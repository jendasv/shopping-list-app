<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HouseholdController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\ShoppingListController;
use Illuminate\Support\Facades\Route;

// Auth (public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'updatePassword']);
        Route::post('/email/resend', [AuthController::class, 'resendVerification'])->middleware('throttle:6,1');
    });

    // Household
    Route::prefix('household')->group(function () {
        Route::get('/', [HouseholdController::class, 'show']);
        Route::put('/', [HouseholdController::class, 'update']);
        Route::post('/{id}/leave', [HouseholdController::class, 'leave']);
    });

    // Invitations
    Route::prefix('invitations')->group(function () {
        Route::post('/', [InvitationController::class, 'send']);
        Route::post('/{token}/accept', [InvitationController::class, 'accept']);
        Route::post('/{token}/decline', [InvitationController::class, 'decline']);
    });

    // Lists
    Route::get('/lists', [ShoppingListController::class, 'index']);
    Route::post('/lists', [ShoppingListController::class, 'store']);
    Route::post('/lists/reorder', [ShoppingListController::class, 'reorder']);
    Route::get('/lists/{id}/items', [ShoppingListController::class, 'show']);
    Route::put('/lists/{id}', [ShoppingListController::class, 'update']);
    Route::delete('/lists/{id}', [ShoppingListController::class, 'destroy']);

    // Items
    Route::post('/lists/{id}/item', [ItemController::class, 'store']);
    Route::post('/lists/{id}/items/reorder', [ItemController::class, 'reorder']);
    Route::get('/lists/{id}/items/{itemId}', [ItemController::class, 'show']);
    Route::put('/lists/{id}/items/{itemId}', [ItemController::class, 'update']);
    Route::delete('/lists/{id}/items/{itemId}', [ItemController::class, 'destroy']);
});
