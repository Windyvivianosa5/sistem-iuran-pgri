<?php

use App\Http\Controllers\LaporanController;
use App\Http\Controllers\KabupatenController;
use App\Http\Controllers\DashboardAdminController;
use App\Http\Controllers\DashboardKabupatenController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Admin\NotifikasiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Iuran;

Route::get('/', function () {
    $iuran = Iuran::all();
        
    return Inertia::render('welcome', [
            'iuran' => $iuran,
        ]);
})->name('home');

// Midtrans webhook (public route)
Route::post('/midtrans/notification', [TransactionController::class, 'notification'])->name('midtrans.notification');
Route::post('/user/payment/callback', [TransactionController::class, 'notification'])->name('midtrans.callback'); // Alternative URL


Route::middleware(['auth', 'verified','role:user'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified','role:admin'])->group(function () {
    Route::get('admin/dashboard/laporan/create', function () {
        return Inertia::render('admin/laporan/create');
    })->name('dashboard-admin-laporan-create');
    Route::resource('admin/dashboard/laporan', LaporanController::class);
    Route::get('admin/dashboard', [DashboardAdminController::class, 'index'])->name('admin.dashboard');
    Route::get('admin/dashboard/notifikasi', [NotifikasiController::class, 'index'])->name('admin.dashboard.notifikasi.index');
    Route::post('/admin/notifikasi/acc/{id}', [NotifikasiController::class, 'acc'])->name('notifikasi.acc');
    Route::get('admin/dashboard/notifikasi/{id}', [NotifikasiController::class, 'show'])->name('admin.dashboard.notifikasi.show');
    Route::post('admin/dashboard/notifikasi/{id}/mark-as-read', [NotifikasiController::class, 'markAsRead'])->name('admin.dashboard.notifikasi.markAsRead');
    Route::post('admin/dashboard/notifikasi/{id}/mark-as-cancel', [NotifikasiController::class, 'markAsCancel'])->name('admin.dashboard.notifikasi.markAsCancel');
    Route::post('/dashboard/notifikasi/mark-all-read', [NotifikasiController::class, 'markAllAsRead'])->name('admin.dashboard.notifikasi.markAllAsRead');

});

Route::middleware(['auth', 'verified','role:kabupaten'])->group(function () {
    Route::get('kabupaten/dashboard', [DashboardKabupatenController::class, 'index'])->name('kabupaten.dashboard');
    
    // Iuran routes (manual instead of resource to avoid conflicts)
    Route::get('/kabupaten/dashboard/iuran', [KabupatenController::class, 'index'])->name('iuran.index');
    Route::get('/kabupaten/dashboard/iuran/create', [KabupatenController::class, 'create'])->name('iuran.create');
    Route::post('/kabupaten/dashboard/iuran', [KabupatenController::class, 'store'])->name('iuran.store');
    Route::get('/kabupaten/dashboard/iuran/{id}', [KabupatenController::class, 'showTransaction'])->name('iuran.show');
    Route::get('/kabupaten/dashboard/iuran/{iuran}/edit', [KabupatenController::class, 'edit'])->name('iuran.edit');
    Route::put('/kabupaten/dashboard/iuran/{iuran}', [KabupatenController::class, 'update'])->name('iuran.update');
    Route::delete('/kabupaten/dashboard/iuran/{iuran}', [KabupatenController::class, 'destroy'])->name('iuran.destroy');
    
    Route::get('/kabupaten/dashboard/laporan', [KabupatenController::class, 'laporan'])->name('kabupaten.laporan');
    
    // Transaction routes
    Route::post('/kabupaten/transaction/create', [TransactionController::class, 'create'])->name('transaction.create');
    Route::get('/kabupaten/transaction/status/{orderId}', [TransactionController::class, 'checkStatus'])->name('transaction.status');
    Route::get('/kabupaten/transactions', [TransactionController::class, 'index'])->name('transaction.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
