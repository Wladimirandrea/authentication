<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// --- 1. RUTAS PÚBLICAS (Para usuarios SIN REGISTRO / GUEST) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- 2. RUTAS GENERALES (Cualquier usuario autenticado: Client, Seller, Admin) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// --- 3. RUTAS EXCLUSIVAS PARA CLIENTES REGISTRADOS ---
Route::middleware(['auth:sanctum', 'role:client'])->group(function () {
    Route::get('/client/dashboard', function () {
        return response()->json([
            'message' => 'Bienvenido a tu panel de cliente.'
        ]);
    });
    // Aquí irán rutas como: ver sus pedidos, guardar direcciones, historial de compras, etc.
});

// --- 4. RUTAS PARA VENDEDORES Y ADMINISTRADORES ---
Route::middleware(['auth:sanctum', 'role:admin,seller'])->group(function () {
    Route::get('/seller/dashboard', function () {
        return response()->json([
            'message' => 'Panel de Vendedor / Admin.'
        ]);
    });
});

// --- 5. RUTAS EXCLUSIVAS PARA ADMINISTRADORES ---
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json([
            'message' => 'Panel exclusivo de Administrador.'
        ]);
    });
});