<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ImageUploadController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\POSController;
use App\Http\Controllers\Admin\PosShiftController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
|
| Here are the admin API routes. These routes require admin authentication.
|
*/

// Admin Authentication (Public)
Route::post('/login', [AuthController::class, 'login']);

// Protected Admin Routes (Require Admin Authentication)
Route::middleware(['auth:sanctum', 'token.timeout', 'admin'])->group(function () {
    // Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Session heartbeat
    Route::get('/session/ping', function () {
        return response()->json(['ok' => true]);
    });

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Products
    Route::get('/products/metrics', [ProductController::class, 'metrics']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::patch('/products/{id}/availability', [ProductController::class, 'updateAvailability']);
    Route::post('/products/{id}/archive', [ProductController::class, 'archive']);
    Route::post('/products/{id}/restore', [ProductController::class, 'restore']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Stock Management
    Route::post('/products/{id}/stock', [StockController::class, 'updateStock']);
    Route::get('/products/{id}/stock-history', [StockController::class, 'getStockHistory']);
    Route::get('/stock/attention', [StockController::class, 'getProductsNeedingAttention']);
    Route::get('/stock/history', [StockController::class, 'getGlobalStockHistory']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::get('/notifications/count', [NotificationController::class, 'count']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications/cleanup', [NotificationController::class, 'cleanup']);

    // Orders
    Route::get('/orders/metrics', [OrderController::class, 'metrics']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::post('/orders/{id}/archive', [OrderController::class, 'archive']);
    Route::post('/orders/{id}/unarchive', [OrderController::class, 'unarchive']);
    Route::post('/orders/upload-proof', [OrderController::class, 'uploadProof']);

    // Users
    Route::get('/users/metrics', [UserController::class, 'metrics']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::patch('/users/{id}/status', [UserController::class, 'updateStatus']);
    Route::post('/users/{id}/restore', [UserController::class, 'restore']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Inquiries
    Route::get('/inquiries', [InquiryController::class, 'index']);
    Route::get('/inquiries/{id}', [InquiryController::class, 'show']);
    Route::post('/inquiries/{id}/messages', [InquiryController::class, 'sendMessage']);
    Route::patch('/inquiries/{id}/status', [InquiryController::class, 'updateStatus']);

    // Image Upload
    Route::post('/upload/image', [ImageUploadController::class, 'upload']);
    Route::delete('/upload/image', [ImageUploadController::class, 'destroy']);

    // POS (Point of Sale)
    Route::get('/pos/products', [POSController::class, 'products']);
    Route::get('/pos/products/{id}/variants', [POSController::class, 'productVariants']);
    Route::get('/pos/orders', [POSController::class, 'orders']);
    Route::post('/pos/orders', [POSController::class, 'store']);
    Route::get('/pos/orders/{id}', [POSController::class, 'show']);
    Route::patch('/pos/orders/{id}/status', [POSController::class, 'updateStatus']);

    // POS Shift Management
    Route::get('/pos/shifts/active', [PosShiftController::class, 'active']);
    Route::post('/pos/shifts/open', [PosShiftController::class, 'open']);
    Route::post('/pos/shifts/{id}/close', [PosShiftController::class, 'close']);
    Route::get('/pos/shifts', [PosShiftController::class, 'index']);
    Route::get('/pos/shifts/{id}', [PosShiftController::class, 'show']);
});
