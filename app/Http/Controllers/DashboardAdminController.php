<?php

namespace App\Http\Controllers;

use App\Models\Iuran;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardAdminController extends Controller
{
    public function index()
    {
        // Fetch all verified contributions with related kabupaten data
        $iurans = Iuran::with('kabupaten')->where('terverifikasi', 'diterima')->latest()->get();

        // Calculate total contributions and transaction count
        $totalMasuk = $iurans->sum('jumlah');
        $jumlahTransaksi = $iurans->count();

        // List of kota in Riau for formatting
        $kotaList = ['Pekanbaru', 'Dumai'];

        // Semua kabupaten/kota di Riau
        $allRiauKabupaten = [
            'Pekanbaru', 'Dumai', 'Bengkalis', 'Indragiri Hilir', 'Indragiri Hulu', 
            'Kampar', 'Kepulauan Meranti', 'Kuantan Singingi', 'Pelalawan', 
            'Rokan Hilir', 'Rokan Hulu', 'Siak'
        ];

        // Map latest 5 transactions
        $transaksiTerbaru = $iurans->take(5)->map(function ($item) use ($kotaList) {
            $kabupatenName = $item->kabupaten->name ?? 'Tidak Diketahui';
            $type = in_array($kabupatenName, $kotaList) ? 'Kota' : 'Kabupaten';
            $formattedName = $kabupatenName !== 'Tidak Diketahui' ? "PGRI {$type} {$kabupatenName}" : 'Tidak Diketahui';

            return [
                'bulan' => \Carbon\Carbon::parse($item->tanggal)->locale('id')->translatedFormat('F'),
                'kabupaten' => $formattedName,
                'total_iuran' => $item->jumlah,
            ];
        });

        // Map latest 5 notifications for verified contributions
        $notifikasi = $iurans->whereNotNull('kabupaten_id')->take(5)->map(function ($item) use ($kotaList) {
            $kabupatenName = $item->kabupaten->name ?? 'Tidak Diketahui';
            $type = in_array($kabupatenName, $kotaList) ? 'Kota' : 'Kabupaten';
            $formattedName = $kabupatenName !== 'Tidak Diketahui' ? "PGRI {$type} {$kabupatenName}" : 'Tidak Diketahui';

            return [
                'id' => $item->id,
                'pesan' => "{$formattedName} mengirim iuran baru",
                'waktu' => \Carbon\Carbon::parse($item->created_at)->format('H:i'),
            ];
        });

        // Fetch monthly contribution report
        $laporans = Iuran::select(
            DB::raw('MONTH(tanggal) as bulan'),
            DB::raw('SUM(jumlah) as total_iuran')
        )
            ->where('terverifikasi', 'diterima') // Match condition with $iurans
            ->groupBy(DB::raw('MONTH(tanggal)'))
            ->orderBy(DB::raw('MONTH(tanggal)'))
            ->get()
            ->map(function ($item) {
                return [
                    'bulan' => \Carbon\Carbon::create()->month($item->bulan)->locale('id')->isoFormat('MMMM'),
                    'total_iuran' => (float) $item->total_iuran, // Ensure numeric type
                ];
            });

        // Ambil data iuran yang sudah ada di database
        $existingIuran = Iuran::select(
            'kabupaten_id',
            DB::raw('SUM(jumlah) as total_iuran'),
            DB::raw('COUNT(*) as jumlah_transaksi')
        )
            ->with('kabupaten')
            ->where('terverifikasi', 'diterima')
            ->whereNotNull('kabupaten_id')
            ->groupBy('kabupaten_id')
            ->get()
            ->keyBy('kabupaten.name');

        // Laporan per kabupaten/kota dengan semua kabupaten Riau
        $laporanKabupaten = collect($allRiauKabupaten)->map(function ($kabupatenName) use ($existingIuran, $kotaList) {
            $type = in_array($kabupatenName, $kotaList) ? 'Kota' : 'Kabupaten';
            $formattedName = "PGRI {$type} {$kabupatenName}";
            
            // Cari data yang ada di database
            $existingData = $existingIuran->get($kabupatenName);
            
            return [
                'kabupaten' => $formattedName,
                'total_iuran' => $existingData ? (float) $existingData->total_iuran : 0,
                'jumlah_transaksi' => $existingData ? $existingData->jumlah_transaksi : 0,
                'status' => $existingData ? 'Ada Data' : 'Tidak Ada Data',
                'total_iuran_formatted' => $existingData ? 
                    'Rp ' . number_format($existingData->total_iuran, 0, ',', '.') : 
                    'Rp. -'
            ];
        })->sortByDesc('total_iuran')->values();

        // Render the admin dashboard with data
        return Inertia::render('admin/dashboard/index', [
            'totalMasuk' => (float) $totalMasuk, // Ensure numeric type
            'jumlahTransaksi' => $jumlahTransaksi,
            'transaksiTerbaru' => $transaksiTerbaru,
            'notifikasi' => $notifikasi,
            'laporans' => $laporans,
            'laporanKabupaten' => $laporanKabupaten,
        ]);
    }
}
?>