<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreShoppingListRequest;
use App\Http\Requests\UpdateShoppingListRequest;
use App\Service\ShoppingListService;
use Illuminate\Http\JsonResponse;

class ShoppingListController extends Controller
{
    public function __construct(private readonly ShoppingListService $shoppingListService) {}

    public function index(): JsonResponse
    {
        return new JsonResponse($this->shoppingListService->getAllLists());
    }

    public function show(int $id): JsonResponse
    {
        return new JsonResponse($this->shoppingListService->getList($id));
    }

    public function store(StoreShoppingListRequest $request): JsonResponse
    {
        return new JsonResponse($this->shoppingListService->createList($request->validated()), 201);
    }

    public function update(UpdateShoppingListRequest $request, int $id): JsonResponse
    {
        return new JsonResponse($this->shoppingListService->updateList($id, $request->validated()));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->shoppingListService->deleteList($id);

        return new JsonResponse(null, 204);
    }
}
