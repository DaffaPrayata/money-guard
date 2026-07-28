<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

// Endpoint Publik (Login & Register)
Route::post('/register', [AuthController::class, 'register']);
// Tambahkan ->name('login') di ujung baris ini:
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Endpoint Terproteksi (Wajib kirim Token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // CRUD Transaksi
    Route::apiResource('transactions', TransactionController::class);
});