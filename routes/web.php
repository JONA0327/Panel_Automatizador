<?php

use App\Http\Controllers\PaqueteController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\EnfermedadController;
use Illuminate\Support\Facades\Route;
// Ruta para mostrar la vista de productos
Route::get('/productos', function () {
    return view('welcome');
})->name('productos.view');

Route::get('/', function () { return view('welcome'); });
// Ruta para mostrar la vista de paquetes
Route::get('/paquetes', function () {
    return view('paquetes');
})->name('paquetes.view');

// Ruta para mostrar la vista de enfermedades
Route::get('/enfermedades', function () {
    return view('enfermedades');
})->name('enfermedades.view');

// Rutas API para productos
Route::post('/productos', [ProductoController::class, 'store'])->name('productos.store');
Route::get('/productos', [ProductoController::class, 'index'])->name('productos.index');
Route::delete('/productos/{id}', [ProductoController::class, 'destroy'])->name('productos.destroy');
Route::put('/productos/{id}', [ProductoController::class, 'update'])->name('productos.update');

// Rutas API para paquetes (con prefijo api)
Route::get('/api/paquetes', [PaqueteController::class, 'index'])->name('paquetes.index');
Route::post('/api/paquetes', [PaqueteController::class, 'store'])->name('paquetes.store');
Route::get('/api/paquetes/{id}', [PaqueteController::class, 'show'])->name('paquetes.show');
Route::put('/api/paquetes/{id}', [PaqueteController::class, 'update'])->name('paquetes.update');
Route::delete('/api/paquetes/{id}', [PaqueteController::class, 'destroy'])->name('paquetes.destroy');

// Rutas API para enfermedades
Route::get('/api/enfermedades', [EnfermedadController::class, 'index'])->name('enfermedades.index');
Route::post('/api/enfermedades', [EnfermedadController::class, 'store'])->name('enfermedades.store');
Route::get('/api/enfermedades/{id}', [EnfermedadController::class, 'show'])->name('enfermedades.show');
Route::put('/api/enfermedades/{id}', [EnfermedadController::class, 'update'])->name('enfermedades.update');
Route::delete('/api/enfermedades/{id}', [EnfermedadController::class, 'destroy'])->name('enfermedades.destroy');
