<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GlobalProduct;
use App\Service\OpenFoodFactsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlobalProductController extends Controller
{
    public function __construct(private readonly OpenFoodFactsService $offService) {}

    /**
     * Search global product library by barcode or name.
     * Returns global products (household_id IS NULL) + current household's own products.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'barcode' => ['sometimes', 'nullable', 'string', 'max:50'],
            'q'       => ['sometimes', 'nullable', 'string', 'min:2', 'max:100'],
        ]);

        $barcode     = $request->input('barcode');
        $query       = $request->input('q');
        $householdId = $request->user()->household()?->id;

        if ($barcode !== null && $barcode !== '') {
            $product = GlobalProduct::where('barcode', $barcode)
                ->where(function ($q) use ($householdId) {
                    $q->whereNull('household_id')
                      ->orWhere('household_id', $householdId);
                })
                ->with(['defaultCategory', 'defaultUnit'])
                ->first();

            if ($product === null) {
                $product = $this->offService->fetchAndStore($barcode);
                if ($product !== null) {
                    $product->load(['defaultCategory', 'defaultUnit']);
                }
            }

            if ($product !== null) {
                $product->increment('scan_count');
            }

            return new JsonResponse($product !== null ? [$this->map($product)] : []);
        }

        if ($query !== null && $query !== '') {
            $results = GlobalProduct::where('name', 'like', '%'.$query.'%')
                ->where(function ($q) use ($householdId) {
                    $q->whereNull('household_id')
                      ->orWhere('household_id', $householdId);
                })
                ->with(['defaultCategory', 'defaultUnit'])
                ->orderByDesc('scan_count')
                ->limit(10)
                ->get()
                ->map(fn (GlobalProduct $p) => $this->map($p))
                ->all();

            return new JsonResponse($results);
        }

        return new JsonResponse([]);
    }

    /**
     * Store a user-submitted product (scanned barcode not found in any database).
     * Saved as household-scoped (household_id set) until admin promotes it globally.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'barcode' => ['required', 'string', 'max:50'],
            'brand'   => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $household = $request->user()->household();

        if ($household === null) {
            return new JsonResponse(['error' => 'No active household.'], 422);
        }

        // If barcode already exists for this household, return it
        $existing = GlobalProduct::where('barcode', $data['barcode'])
            ->where(function ($q) use ($household) {
                $q->whereNull('household_id')
                  ->orWhere('household_id', $household->id);
            })
            ->first();

        if ($existing !== null) {
            return new JsonResponse($this->map($existing), 200);
        }

        $product = GlobalProduct::create([
            'household_id' => $household->id,
            'barcode'      => $data['barcode'],
            'name'         => $data['name'],
            'brand'        => $data['brand'] ?? null,
            'source'       => 'user',
            'verified'     => false,
            'scan_count'   => 1,
        ]);

        return new JsonResponse($this->map($product), 201);
    }

    /** @return array<string, mixed> */
    private function map(GlobalProduct $product): array
    {
        return [
            'id'                  => $product->id,
            'name'                => $product->name,
            'brand'               => $product->brand,
            'barcode'             => $product->barcode,
            'image_url'           => $product->image_url,
            'default_category_id' => $product->default_category_id,
            'default_unit_id'     => $product->default_unit_id,
            'verified'            => $product->verified,
            'scan_count'          => $product->scan_count,
        ];
    }
}
