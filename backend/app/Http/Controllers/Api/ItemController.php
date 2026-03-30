<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Service\ItemService;
use Illuminate\Http\JsonResponse;

class ItemController extends Controller
{
    public function __construct(private readonly ItemService $itemService) {}

    public function index(int $id): JsonResponse
    {
        return new JsonResponse($this->itemService->getItemsForList($id));
    }

    public function show(int $id, int $itemId): JsonResponse
    {
        return new JsonResponse($this->itemService->getItem($id, $itemId));
    }

    public function store(StoreItemRequest $request, int $id): JsonResponse
    {
        return new JsonResponse($this->itemService->createItemForList($id, $request->validated()), 201);
    }

    public function update(UpdateItemRequest $request, int $id, int $itemId): JsonResponse
    {
        return new JsonResponse($this->itemService->updateItem($id, $itemId, $request->validated()));
    }

    public function destroy(int $id, int $itemId): JsonResponse
    {
        $this->itemService->deleteItem($id, $itemId);

        return new JsonResponse(null, 204);
    }
}
