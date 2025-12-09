<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Iuran;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index()
    {
        $iuran = Iuran::all();
        
        return Inertia::render('admin/laporan/index', [
            'iuran' => $iuran,
        ]);
    }



    public function store(Request $request)
    {
      
    }

    public function destroy(Laporan $laporan)
    {
        $laporan->delete();

        return redirect()->back()->with('success', 'Laporan berhasil dihapus.');
    }
}
