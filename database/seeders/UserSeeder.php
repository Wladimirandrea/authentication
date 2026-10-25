<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ========================================
        // ADMINISTRADOR
        // ========================================
        User::updateOrCreate(
            ['email' => 'admin@sistema.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('123456789'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // ========================================
        // VENDEDOR
        // ========================================
        User::updateOrCreate(
            ['email' => 'seller@sistema.com'],
            [
                'name' => 'Vendedor',
                'password' => Hash::make('123456789'),
                'role' => 'seller',
                'email_verified_at' => now(),
            ]
        );

        // ========================================
        // CLIENTE
        // ========================================
        User::updateOrCreate(
            ['email' => 'client@sistema.com'],
            [
                'name' => 'Cliente',
                'password' => Hash::make('123456789'),
                'role' => 'client',
                'email_verified_at' => now(),
            ]
        );
    }
}
