<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat admin utama jika belum ada
        User::firstOrCreate(
            [
                'email' => 'adminpgri@gmail.com',
                'name' => 'admin',
                'password' => Hash::make('admin'),
                'role' => 'admin',
                'email_verified_at' => now(),
                'anggota' => 1
            ]
        );

        // Panggil seeder kabupaten
        $this->call([
            KabupatenSeeder::class,
        ]);
    }
}
