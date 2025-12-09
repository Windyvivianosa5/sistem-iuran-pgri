<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class KabupatenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Gabungkan nama kabupaten dan jumlah anggota jadi satu array asosiatif
        $kabupatenAnggota = [
            'Pekanbaru' => 5100,
            'Dumai' => 3000,
            'Kampar' => 5953,
            'Rokan Hulu' => 3078,
            'Rokan Hilir' => 2600,
            'Bengkalis' => 4080,
            'Siak' => 2476,
            'Pelalawan' => 4400,
            'Indragiri Hulu' => 2436,
            'Indragiri Hilir' => 4863,
            'Kepulauan Meranti' => 3215,
            'Kuantan Singingi' => 3900,
        ];

        foreach ($kabupatenAnggota as $kabupaten => $jumlahAnggota) {
            $email = strtolower(str_replace(' ', '', $kabupaten)) . '@gmail.com';

            if (!User::where('email', $email)->exists()) {
                User::create([
                    'name' => $kabupaten,
                    'email' => $email,
                    'anggota' => $jumlahAnggota,
                    'email_verified_at' => now(),
                    'password' => Hash::make('asdasdasd'),
                    'role' => 'kabupaten',
                ]);
            }
        }
    }
}
