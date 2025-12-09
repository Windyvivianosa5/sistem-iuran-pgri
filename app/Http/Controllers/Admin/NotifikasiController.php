<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Iuran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotifikasiController extends Controller
{
    public function index()
    {
        $notifikasis = Iuran::orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/notifikasi/index', [
            'notifikasis' => $notifikasis
        ]);
    }

    public function show($id)
    {
        $notifikasi = Iuran::with('kabupaten')->findOrFail($id);

        return Inertia::render('admin/notifikasi/show', [
            'notifikasi' => $notifikasi,
        ]);
    }

    public function markAsRead($id)
    {
        $notifikasi = Iuran::findOrFail($id);

        $notifikasi->terverifikasi = 'diterima';
        $notifikasi->save();

        if ($notifikasi->iuran) {
            $notifikasi->iuran->terverifikasi = 'diterima';
            $notifikasi->iuran->save();
        }

        return redirect()->back()->with('success', 'Notifikasi dan terverifikasi iuran telah dikonfirmasi.');
    }

    public function markAsCancel($id)
    {
        $notifikasi = Iuran::findOrFail($id);

        $notifikasi->terverifikasi = 'ditolak';
        $notifikasi->save();

        if ($notifikasi->iuran) {
            $notifikasi->iuran->terverifikasi = 'ditolak';
            $notifikasi->iuran->save();
        }

        return redirect()->back()->with('success', 'Notifikasi dan status iuran telah dibatalkan.');
    }

    public function markAllAsRead()
    {
        $iurans = Iuran::where('terverifikasi', 'pending')->get();

        foreach ($iurans as $iuran) {
            $iuran->terverifikasi = 'diterima';
            $iuran->save();

            if ($iuran->iuran) {
                $iuran->iuran->terverifikasi = 'diterima';
                $iuran->iuran->save();
            }
        }

        return back()->with('success', 'Semua notifikasi berhasil di-ACC');
    }
}
