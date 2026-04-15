<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListRequest;
use App\Http\Requests\UpdateListRequest;
use App\Service\ListService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListController extends Controller
{
    public function __construct(private readonly ListService $listService) {}

    public function index(Request $request): JsonResponse
    {
        return new JsonResponse($this->listService->getAllLists($request->user(), $request->only(['search', 'filter', 'sort', 'page'])));
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return new JsonResponse($this->listService->getList($id, $request->user()));
    }

    public function store(StoreListRequest $request): JsonResponse
    {
        return new JsonResponse($this->listService->createList($request->validated(), $request->user()), 201);
    }

    public function update(UpdateListRequest $request, int $id): JsonResponse
    {
        return new JsonResponse($this->listService->updateList($id, $request->validated(), $request->user()));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->listService->deleteList($id, $request->user());

        return new JsonResponse(null, 204);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate(['order' => ['required', 'array'], 'order.*' => ['integer']]);
        $this->listService->reorderLists($request->input('order'), $request->user());

        return new JsonResponse(null, 204);
    }
}
