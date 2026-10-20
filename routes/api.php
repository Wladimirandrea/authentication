<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// --- 1. RUTAS PÚBLICAS (Para usuarios SIN REGISTRO / GUEST) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Route::get('/products', [ProductController::class, 'index']); // Ejemplo de catálogo público

// --- 2. RUTAS GENERALES (Cualquier usuario autenticado: Client, Seller, Admin) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// --- 3. RUTAS PARA VENDEDORES Y ADMINISTRADORES ---
Route::middleware(['auth:sanctum', 'role:admin,seller'])->group(function () {
    Route::get('/seller/dashboard', function () {
        return response()->json(['message' => 'Panel de Vendedor / Admin']);
    });
});

// --- 4. RUTAS EXCLUSIVAS PARA ADMINISTRADORES ---
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json(['message' => 'Panel exclusivo de Administrador']);
    });
});