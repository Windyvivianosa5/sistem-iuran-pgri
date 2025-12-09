<?php

namespace App\Http\Controllers;

use App\Models\Iuran;
use App\Models\Transaction;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashboardKabupatenController extends Controller
{
   public function index()
    {
        $userName = Auth::user()->name; // Ambil nama user login
        $kotaList = ['Pekanbaru', 'Dumai'];

        // Ambil iuran berdasarkan nama kabupaten = nama user login
        $iurans = Iuran::whereHas('kabupaten', function ($query) use ($userName) {
            $query->where('name', $userName);
        })
        ->with('kabupaten')
        ->where('terverifikasi', 'diterima')
        ->latest()
        ->get();

        $totalMasuk = $iurans->sum('jumlah');
        $jumlahTransaksi = $iurans->count();

        $transaksiTerbaru = $iurans->take(5)->map(function ($item) use ($kotaList) {
            $kabupatenName = $item->kabupaten->name ?? 'Tidak Diketahui';
            $type = in_array($kabupatenName, $kotaList) ? 'Kota' : 'Kabupaten';
            $formattedName = "PGRI {$type} {$kabupatenName}";

            return [
                'bulan' => \Carbon\Carbon::parse($item->tanggal)->locale('id')->translatedFormat('F'),
                'kabupaten' => $formattedName,
                'total_iuran' => $item->jumlah,
            ];
        });

        $notifikasi = $iurans->whereNotNull('kabupaten_id')->take(5)->map(function ($item) use ($kotaList) {
            $kabupatenName = $item->kabupaten->name ?? 'Tidak Diketahui';
            $type = in_array($kabupatenName, $kotaList) ? 'Kota' : 'Kabupaten';
            $formattedName = "PGRI {$type} {$kabupatenName}";

            return [
                'id' => $item->id,
                'pesan' => "{$formattedName} mengirim iuran baru",
                'waktu' => \Carbon\Carbon::parse($item->created_at)->format('H:i'),
            ];
        });

        // Laporan bulanan untuk user login
        $laporans = Iuran::select(
            DB::raw('MONTH(tanggal) as bulan'),
            DB::raw('SUM(jumlah) as total_iuran')
        )
            ->whereHas('kabupaten', function ($query) use ($userName) {
                $query->where('name', $userName);
            })
            ->where('terverifikasi', 'diterima')
            ->groupBy(DB::raw('MONTH(tanggal)'))
            ->orderBy(DB::raw('MONTH(tanggal)'))
            ->get()
            ->map(function ($item) {
                return [
                    'bulan' => \Carbon\Carbon::create()->month($item->bulan)->locale('id')->isoFormat('MMMM'),
                    'total_iuran' => (float) $item->total_iuran,
                ];
            });

             $type = in_array($userName, $kotaList) ? 'Kota' : 'Kabupaten';
            $formattedName = "{$type} {$userName}";
           
        // Get recent transactions
        $recentTransactions = Transaction::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'order_id' => $transaction->order_id,
                    'amount' => $transaction->gross_amount,
                    'status' => $transaction->status,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at->format('d M Y H:i'),
                ];
            });

        return Inertia::render('kabupaten/dashboard/index', [
            'totalMasuk' => (float) $totalMasuk,
            'jumlahTransaksi' => $jumlahTransaksi,
            'transaksiTerbaru' => $transaksiTerbaru,
            'notifikasi' => $notifikasi,
            'laporans' => $laporans,
            'jumlahAnggota' => Auth::user()->anggota,
            'namaUser' => $formattedName,
            'recentTransactions' => $recentTransactions,
            'midtransClientKey' => config('midtrans.client_key'),
        ]);
    }

}
