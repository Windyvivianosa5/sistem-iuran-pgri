<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Iuran;
use Carbon\Carbon;
use App\Models\Notifikasi;
use Illuminate\Support\Facades\DB;
    

use Illuminate\Http\Request;

class KabupatenController extends Controller
{
    public function index()
    {
    // Fetch transactions instead of iuran
    $transactions = \App\Models\Transaction::where('user_id', auth()->id())
        ->latest()
        ->get();

    return Inertia::render('kabupaten/iuran/index', [
        'transactions' => $transactions,
        'midtransClientKey' => config('midtrans.client_key'),
        ]);
    }

    public function create()
    {
        return Inertia::render('kabupaten/iuran/create', [
            'midtransClientKey' => config('midtrans.client_key'),
        ]);
    }

    public function store(Request $request)
    {
        $validateData = $request->validate([
            'jumlah' => 'required|integer|min:0',
            'tanggal' => 'required|date|string',
            'bukti' => 'required|file|nullable',
            'keterangan' => 'required|string'

        ]);

        // dd($validateData); 

        $buktiPart = $validateData['bukti']->store('bukti', 'public');
  
    //   $tanggalMysql = Carbon::parse($validateData['tanggal'])->setTimezone('Asia/Jakarta')->format('Y-m-d');


        // $datetime = Carbon::parse($validateData['tanggal'])->format('Y-m-d');

     $iuran = Iuran::create([
        'kabupaten_id' => $request->user()->id,
        'jumlah' => $validateData['jumlah'],
        'tanggal' => $validateData['tanggal'],
        'bukti_transaksi' => $buktiPart,
        'deskripsi' => $validateData['keterangan'],
        'terverifikasi' => 'pending'
    ]);

    return redirect()->route('iuran.index')->with('success', 'Data kabupaten berhasil ditambahkan dan notifikasi terkirim.');
}

    public function edit($id)
    {
        $kabupaten = Iuran::findOrfail($id);
        return Inertia::render('kabupaten/iuran/update', [
            'kabupaten' => $kabupaten,
        ]);
    }

   public function update(Request $request, Iuran $iuran)
{
    try {
        $data = $request->validate([
            'jumlah' => 'required|integer|min:0',
            'tanggal' => 'required|date|string',
            'bukti' => 'nullable|file',
            'deskripsi' => 'required|string'
        ]);

        if ($request->hasFile('bukti')) {
            // Hapus file lama kalau perlu
            if ($iuran->bukti_transaksi) {
                Storage::disk('public')->delete($iuran->bukti_transaksi);
            }

            $path = $request->file('bukti')->store('bukti', 'public');
            $data['bukti_transaksi'] = $path;
        }

        $iuran->update($data);

        return redirect()->route('iuran.index')->with('success', 'Data kabupaten berhasil diupdate.');
    } catch (\Exception $e) {
        return redirect()->back()->withInput()->withErrors([
            'error' => 'Gagal update: ' . $e->getMessage()
        ]);
    }
    }
    
    public function show(Iuran $iuran)
    {
        // Try to find associated transaction
        // Assuming transaction description contains iuran ID or we can match by user and amount
        $transaction = \App\Models\Transaction::where('user_id', $iuran->kabupaten_id)
            ->where('gross_amount', $iuran->jumlah)
            ->where('status', 'settlement')
            ->latest()
            ->first();

        return Inertia::render('kabupaten/iuran/show', [
            'iuran' => $iuran,
            'transaction' => $transaction,
        ]);
        
    }
    public function laporan()
{
    // Ambil semua iuran yang sudah diverifikasi untuk kabupaten yang sedang login
    $iuran = Iuran::with('kabupaten')
        // ->where('kabupaten_id', Auth::id())
        ->where('terverifikasi', 'diterima')
        ->get();

    // Buat rekap bulanan
    $laporans = Iuran::select(
            DB::raw('MONTH(tanggal) as bulan'),
            DB::raw('SUM(jumlah) as total_iuran')
        )
        // ->where('kabupaten_id', Auth::id())
        ->where('terverifikasi', 'diterima')
        ->groupBy(DB::raw('MONTH(tanggal)'))
        ->orderBy(DB::raw('MONTH(tanggal)'))
        ->get()
        ->map(function ($item) {
            return [
                'bulan' => Carbon::create()->month($item->bulan)->locale('id')->isoFormat('MMMM'),
                'total_iuran' => (float) $item->total_iuran,
            ];
        });

    return Inertia::render('kabupaten/laporan/index', [
        'iuran' => $iuran,
        'laporans' => $laporans,
    ]);
    
}
public function destroy(Iuran $iuran)
{
    try {
        // Hapus file bukti jika ada
        if ($iuran->bukti_transaksi) {
            \Storage::disk('public')->delete($iuran->bukti_transaksi);
        }

        $iuran->delete();

        return redirect()->route('iuran.index')->with('success', 'Data iuran berhasil dihapus.');
    } catch (\Exception $e) {
        return redirect()->back()->withErrors([
            'error' => 'Gagal menghapus iuran: ' . $e->getMessage()
        ]);
    }
}

    /**
     * Show transaction details
     */
    public function showTransaction($id)
    {
        $transaction = \App\Models\Transaction::findOrFail($id);
        
        // Create a dummy iuran object for backward compatibility
        $iuran = (object) [
            'id' => $transaction->id,
            'jumlah' => $transaction->gross_amount,
            'deskripsi' => $transaction->description,
            'tanggal' => $transaction->created_at,
            'terverifikasi' => $transaction->status === 'settlement' ? 'diterima' : 'pending',
            'bukti_transaksi' => null,
        ];

        return Inertia::render('kabupaten/iuran/show', [
            'iuran' => $iuran,
            'transaction' => $transaction,
        ]);
    }

}