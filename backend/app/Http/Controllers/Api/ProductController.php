<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Service\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private readonly ProductService $productService) {}

    /**
     * Autocomplete — min 2 chars, max 10 results.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:100'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:25'],
        ]);

        $results = $this->productService->search(
            $request->string('q')->toString(),
            $request->user(),
            (int) $request->input('limit', 10),
        );

        return new JsonResponse($results);
    }

    /**
     * Full catalog with pagination and optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Product::class);

        $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'category_id' => ['sometimes', 'nullable', 'integer'],
            'q' => ['sometimes', 'nullable', 'string', 'max:100'],
        ]);

        return new JsonResponse($this->productService->index(
            $request->user(),
            (int) $request->input('page', 1),
            $request->input('category_id') !== null ? (int) $request->input('category_id') : null,
            $request->input('q'),
        ));
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $this->authorize('create', Product::class);

        return new JsonResponse($this->productService->create($request->validated(), $request->user()), 201);
    }

    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        $product = $this->productService->findForHousehold($id, $request->user());
        $this->authorize('update', $product);

        return new JsonResponse($this->productService->update($product, $request->validated()));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $product = $this->productService->findForHousehold($id, $request->user());
        $this->authorize('delete', $product);
        $this->productService->delete($product);

        return new JsonResponse(null, 204);
    }
}
