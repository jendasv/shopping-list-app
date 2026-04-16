<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\GlobalProductController;
use App\Http\Controllers\Api\HouseholdController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\ListController;
use App\Http\Controllers\Api\ListItemController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UnitController;
use Illuminate\Support\Facades\Route;

// Auth — public, rate limited
Route::middleware('throttle:auth')->prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Authenticated routes
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {

    // No email verification required
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/email/resend', [AuthController::class, 'resendVerification'])->middleware('throttle:6,1');
    });

    // Invitation accept/decline — no verification required
    // (user may click the link before verifying their email)
    Route::post('/invitations/{token}/accept', [InvitationController::class, 'accept']);
    Route::post('/invitations/{token}/decline', [InvitationController::class, 'decline']);

    // All remaining routes require verified email
    Route::middleware('verified')->group(function () {

        // Auth — profile & password
        Route::prefix('auth')->group(function () {
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::put('/password', [AuthController::class, 'updatePassword']);
        });

        // Household
        Route::prefix('household')->group(function () {
            Route::get('/', [HouseholdController::class, 'show']);
            Route::put('/', [HouseholdController::class, 'update']);
            Route::post('/{id}/leave', [HouseholdController::class, 'leave']);
            Route::delete('/members/{userId}', [HouseholdController::class, 'removeMember']);
        });

        // Invitations — send requires verified email
        Route::post('/invitations', [InvitationController::class, 'send']);

        // Lists
        Route::get('/lists', [ListController::class, 'index']);
        Route::post('/lists', [ListController::class, 'store']);
        Route::post('/lists/reorder', [ListController::class, 'reorder']);
        Route::get('/lists/{id}', [ListController::class, 'show']);
        Route::put('/lists/{id}', [ListController::class, 'update']);
        Route::delete('/lists/{id}', [ListController::class, 'destroy']);

        // List items
        Route::post('/lists/{id}/items', [ListItemController::class, 'store']);
        Route::post('/lists/{id}/items/reorder', [ListItemController::class, 'reorder']);
        Route::get('/lists/{id}/items/{itemId}', [ListItemController::class, 'show']);
        Route::put('/lists/{id}/items/{itemId}', [ListItemController::class, 'update']);
        Route::delete('/lists/{id}/items/{itemId}', [ListItemController::class, 'destroy']);

        // Product catalog
        Route::get('/products/search', [ProductController::class, 'search']);
        Route::get('/products', [ProductController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Categories
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Global product library
        Route::get('/global-products/search', [GlobalProductController::class, 'search']);

        // Units
        Route::get('/units', [UnitController::class, 'index']);
    });
});
