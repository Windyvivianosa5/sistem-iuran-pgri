<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Iuran extends Model
{
    use HasFactory;

    // Nama tabel (opsional jika nama class = nama tabel)
    protected $with = ['kabupaten'];

    // Kolom yang bisa diisi (mass assignable)
    protected $fillable = [
        'kabupaten_id',
        'jumlah',
        'bukti_transaksi',
        'tanggal',
        'deskripsi',
        'terverifikasi',
    ];

    /**
     * Relasi ke model Kabupaten atau User (tergantung kamu simpan di mana)
     * Ganti `Kabupaten` dengan `User` jika pakai tabel `users`
     */
    public function kabupaten(): BelongsTo
    {
        return $this->belongsTo(User::class);
    
    }

}
