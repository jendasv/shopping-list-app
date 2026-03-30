<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ShoppingListController;
use App\Http\Controllers\Api\ItemController;

// Lists
Route::get('/lists', [ShoppingListController::class, 'index']);
Route::post('/lists', [ShoppingListController::class, 'store']);
Route::get('/lists/{id}/items', [ShoppingListController::class, 'show']);
Route::put('/lists/{id}', [ShoppingListController::class, 'update']);
Route::delete('/lists/{id}', [ShoppingListController::class, 'destroy']);

// Items
Route::post('/lists/{id}/item', [ItemController::class, 'store']);

Route::get('/lists/{id}/items/{itemId}', [ItemController::class, 'show']);
Route::put('/lists/{id}/items/{itemId}', [ItemController::class, 'update']);
Route::delete('/lists/{id}/items/{itemId}', [ItemController::class, 'destroy']);
