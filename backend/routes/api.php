<?php

use App\Http\Controllers\User\AuthController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\ContactController;
use App\Http\Controllers\User\InquiryController;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\User\ProductController;
use App\Http\Controllers\User\UserProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication Routes (Public)
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// Public Product Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/{id}/variant-groups', [ProductController::class, 'variantGroups']);

// Public Contact Route
Route::post('/contact', [ContactController::class, 'store']);

// Protected Routes (Require Authentication)
Route::middleware(['auth:sanctum', 'token.timeout', 'check.status'])->group(function () {
    // Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Session heartbeat
    Route::get('/session/ping', function () {
        return response()->json(['ok' => true]);
    });

    // Cart Routes
    Route::get('/cart/count', [CartController::class, 'count']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::get('/cart/validate', [CartController::class, 'validateStock']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Order Routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    // User Profile Routes
    Route::get('/user/recent-orders', [UserProfileController::class, 'recentOrders']);
    Route::put('/user/profile', [UserProfileController::class, 'updateProfile']);
    Route::put('/user/password', [UserProfileController::class, 'updatePassword']);
    Route::put('/user/language', [UserProfileController::class, 'updateLanguage']);
    Route::post('/user/soft-delete', [UserProfileController::class, 'softDelete']);

    // Inquiry Routes
    Route::get('/inquiries', [InquiryController::class, 'index']);
    Route::get('/inquiries/{id}', [InquiryController::class, 'show']);
    Route::post('/inquiries/{id}/messages', [InquiryController::class, 'sendMessage']);
});

// Admin Routes
Route::prefix('admin')->group(base_path('routes/admin.php'));
