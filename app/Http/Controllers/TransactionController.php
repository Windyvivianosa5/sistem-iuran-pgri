<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class TransactionController extends Controller
{
    public function __construct()
    {
        // Set Midtrans configuration
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Create a new transaction
     */
    public function create(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1000',
            'description' => 'nullable|string|max:255',
        ]);

        try {
            $user = Auth::user();
            $orderId = 'TRX-' . $user->id . '-' . time();

            // Create transaction record
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'order_id' => $orderId,
                'gross_amount' => $request->amount,
                'description' => $request->description ?? 'Pembayaran Iuran PGRI',
                'status' => 'pending',
            ]);

            // Prepare Midtrans transaction details
            $params = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => $request->amount,
                ],
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                ],
                'item_details' => [
                    [
                        'id' => 'IURAN-001',
                        'price' => $request->amount,
                        'quantity' => 1,
                        'name' => $request->description ?? 'Iuran PGRI',
                    ],
                ],
            ];

            // Get Snap Token
            $snapToken = Snap::getSnapToken($params);
            
            // Update transaction with snap token
            $transaction->update(['snap_token' => $snapToken]);

            return response()->json([
                'success' => true,
                'snap_token' => $snapToken,
                'order_id' => $orderId,
            ]);
        } catch (\Exception $e) {
            Log::error('Transaction creation failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat transaksi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle Midtrans notification callback
     */
    public function notification(Request $request)
    {
        try {
            $notification = new Notification();

            $transactionStatus = $notification->transaction_status;
            $orderId = $notification->order_id;
            $fraudStatus = $notification->fraud_status ?? null;

            $transaction = Transaction::where('order_id', $orderId)->firstOrFail();

            // Update transaction details
            $transaction->update([
                'transaction_id' => $notification->transaction_id,
                'payment_type' => $notification->payment_type,
                'transaction_time' => $notification->transaction_time,
            ]);

            // Handle transaction status
            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'accept') {
                    $transaction->update(['status' => 'settlement']);
                }
            } elseif ($transactionStatus == 'settlement') {
                $transaction->update([
                    'status' => 'settlement',
                    'settlement_time' => now(),
                ]);
                
                // Create iuran record for admin dashboard
                $this->createIuranFromTransaction($transaction);
            } elseif ($transactionStatus == 'pending') {
                $transaction->update(['status' => 'pending']);
            } elseif ($transactionStatus == 'deny') {
                $transaction->update(['status' => 'deny']);
            } elseif ($transactionStatus == 'expire') {
                $transaction->update(['status' => 'expire']);
            } elseif ($transactionStatus == 'cancel') {
                $transaction->update(['status' => 'cancel']);
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Notification handling failed: ' . $e->getMessage());
            return response()->json(['success' => false], 500);
        }
    }

    /**
     * Check transaction status
     */
    public function checkStatus($orderId)
    {
        try {
            $transaction = Transaction::where('order_id', $orderId)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'transaction' => $transaction,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan',
            ], 404);
        }
    }

    /**
     * Get user transactions
     */
    public function index()
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Create iuran record from successful transaction
     */
    private function createIuranFromTransaction(Transaction $transaction)
    {
        try {
            // Check if iuran already exists for this transaction
            $existingIuran = \App\Models\Iuran::where('kabupaten_id', $transaction->user_id)
                ->where('jumlah', $transaction->gross_amount)
                ->where('tanggal', $transaction->created_at->format('Y-m-d'))
                ->first();

            if (!$existingIuran) {
                \App\Models\Iuran::create([
                    'kabupaten_id' => $transaction->user_id,
                    'jumlah' => $transaction->gross_amount,
                    'tanggal' => $transaction->created_at,
                    'deskripsi' => $transaction->description,
                    'terverifikasi' => 'diterima', // Auto-approve Midtrans payments
                    'bukti_transaksi' => 'midtrans_' . $transaction->order_id, // Store order_id as proof
                ]);

                Log::info("Iuran created from transaction: {$transaction->order_id}");
            }
        } catch (\Exception $e) {
            Log::error("Failed to create iuran from transaction: " . $e->getMessage());
        }
    }
}
