<?php

declare(strict_types=1);

namespace App\Service;

use App\Exceptions\Domain\PaymentRequiredException;
use App\Exceptions\Domain\ResourceNotFoundException;
use App\Exceptions\Infrastructure\DatabaseOperationException;
use App\Models\Product;
use App\Models\User;
use Throwable;

class ProductService
{
    private const FREE_TIER_LIMIT = 50;

    /**
     * Autocomplete — search by name within the user's household.
     *
     * @return array<int, array<string, mixed>>
     */
    public function search(string $query, User $user, int $limit = 10): array
    {
        $householdId = $user->household()?->id;

        return Product::where('household_id', $householdId)
            ->where('name', 'like', '%'.$query.'%')
            ->with(['preferredUnit', 'category'])
            ->orderBy('name')
            ->limit($limit)
            ->get()
            ->map(fn (Product $p) => $this->map($p))
            ->all();
    }

    /**
     * Full catalog with pagination and optional filters.
     *
     * @return array<string, mixed>
     */
    public function index(User $user, int $page = 1, ?int $categoryId = null, ?string $search = null): array
    {
        $householdId = $user->household()?->id;

        $query = Product::where('household_id', $householdId)
            ->with(['preferredUnit', 'category'])
            ->orderBy('name');

        if ($categoryId !== null) {
            $query->where('category_id', $categoryId);
        }

        if ($search !== null && $search !== '') {
            $query->where('name', 'like', '%'.$search.'%');
        }

        $paginated = $query->paginate(50, page: $page);

        return [
            'data' => $paginated->map(fn (Product $p) => $this->map($p))->values()->all(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'total' => $paginated->total(),
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function create(array $data, User $user): array
    {
        $household = $user->household();

        $count = Product::where('household_id', $household->id)->count();
        if ($count >= self::FREE_TIER_LIMIT) {
            throw new PaymentRequiredException;
        }

        try {
            $product = Product::create([
                'household_id' => $household->id,
                'created_by' => $user->id,
                'name' => $data['name'],
                'category_id' => $data['category_id'] ?? null,
                'preferred_unit_id' => $data['preferred_unit_id'] ?? null,
                'preferred_quantity' => $data['preferred_quantity'] ?? null,
                'notes' => $data['notes'] ?? null,
                'barcode' => $data['barcode'] ?? null,
                'global_product_id' => $data['global_product_id'] ?? null,
            ]);
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to create product: '.$e->getMessage());
        }

        $product->load(['preferredUnit', 'category']);

        return $this->map($product);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function update(Product $product, array $data): array
    {
        if (array_key_exists('name', $data)) {
            $product->name = $data['name'];
        }
        if (array_key_exists('category_id', $data)) {
            $product->category_id = $data['category_id'];
        }
        if (array_key_exists('preferred_unit_id', $data)) {
            $product->preferred_unit_id = $data['preferred_unit_id'];
        }
        if (array_key_exists('preferred_quantity', $data)) {
            $product->preferred_quantity = $data['preferred_quantity'];
        }
        if (array_key_exists('notes', $data)) {
            $product->notes = $data['notes'];
        }
        if (array_key_exists('barcode', $data)) {
            $product->barcode = $data['barcode'];
        }

        try {
            $product->save();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to update product: '.$e->getMessage());
        }

        $product->load(['preferredUnit', 'category']);

        return $this->map($product);
    }

    public function delete(Product $product): void
    {
        try {
            $product->delete();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to delete product: '.$e->getMessage());
        }
    }

    public function findForHousehold(int $productId, User $user): Product
    {
        $householdId = $user->household()?->id;

        $product = Product::where('id', $productId)
            ->where('household_id', $householdId)
            ->first();

        if ($product === null) {
            throw new ResourceNotFoundException('Product not found.');
        }

        return $product;
    }

    /**
     * @return array<string, mixed>
     */
    public function map(Product $product): array
    {
        $category = $product->relationLoaded('category') ? $product->category : null;
        $unit = $product->relationLoaded('preferredUnit') ? $product->preferredUnit : null;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'barcode' => $product->barcode,
            'notes' => $product->notes,
            'preferred_quantity' => $product->preferred_quantity,
            'category_id' => $product->category_id,
            'category' => $category !== null
                ? ['id' => $category->id, 'name' => $category->translated_name ?? $category->name]
                : null,
            'preferred_unit_id' => $product->preferred_unit_id,
            'unit' => $unit !== null
                ? ['id' => $unit->id, 'symbol' => $unit->symbol]
                : null,
            'global_product_id' => $product->global_product_id,
        ];
    }
}
