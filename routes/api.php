<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas generales (Cualquier usuario autenticado)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Ruta exclusiva para Administradores
Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/dashboard', function () {
    return response()->json([
        'message' => 'Bienvenido al panel de administración, Administrador.'
    ]);
});

// Ruta para Administradores o Editores
Route::middleware(['auth:sanctum', 'role:admin,editor'])->get('/posts/manage', function () {
    return response()->json([
        'message' => 'Tienes acceso para gestionar publicaciones.'
    ]);
});