<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreShoppingListRequest;
use App\Http\Requests\UpdateShoppingListRequest;
use App\Service\ShoppingListService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShoppingListController extends Controller
{
    public function __construct(private readonly ShoppingListService $shoppingListService) {}

    public function index(Request $request): JsonResponse
    {
        return new JsonResponse($this->shoppingListService->getAllLists($request->user(), $request->only(['search', 'filter', 'sort', 'page'])));
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return new JsonResponse($this->shoppingListService->getList($id, $request->user()));
    }

    public function store(StoreShoppingListRequest $request): JsonResponse
    {
        return new JsonResponse($this->shoppingListService->createList($request->validated(), $request->user()), 201);
    }

    public function update(UpdateShoppingListRequest $request, int $id): JsonResponse
    {
        return new JsonResponse($this->shoppingListService->updateList($id, $request->validated(), $request->user()));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->shoppingListService->deleteList($id, $request->user());

        return new JsonResponse(null, 204);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate(['order' => ['required', 'array'], 'order.*' => ['integer']]);
        $this->shoppingListService->reorderLists($request->input('order'), $request->user());

        return new JsonResponse(null, 204);
    }
}
