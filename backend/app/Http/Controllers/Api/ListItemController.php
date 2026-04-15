<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListItemRequest;
use App\Http\Requests\UpdateListItemRequest;
use App\Service\ItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListItemController extends Controller
{
    public function __construct(private readonly ItemService $itemService) {}

    public function show(Request $request, int $id, int $itemId): JsonResponse
    {
        return new JsonResponse($this->itemService->getItem($id, $itemId, $request->user()));
    }

    public function store(StoreListItemRequest $request, int $id): JsonResponse
    {
        return new JsonResponse($this->itemService->createItemForList($id, $request->validated(), $request->user()), 201);
    }

    public function update(UpdateListItemRequest $request, int $id, int $itemId): JsonResponse
    {
        return new JsonResponse($this->itemService->updateItem($id, $itemId, $request->validated(), $request->user()));
    }

    public function destroy(Request $request, int $id, int $itemId): JsonResponse
    {
        $this->itemService->deleteItem($id, $itemId, $request->user());

        return new JsonResponse(null, 204);
    }

    public function reorder(Request $request, int $id): JsonResponse
    {
        $request->validate(['order' => ['required', 'array'], 'order.*' => ['integer']]);
        $this->itemService->reorderItems($id, $request->input('order'), $request->user());

        return new JsonResponse(null, 204);
    }
}
