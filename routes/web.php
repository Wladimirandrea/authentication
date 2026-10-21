<?php

use Illuminate\Support\Facades\Route;


// Cualquier ruta que no sea /api será manejada por Vue
Route::get('{any}', function () {
    return view('app');
})->where('any', '.*');