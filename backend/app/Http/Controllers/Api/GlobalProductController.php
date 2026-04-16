<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GlobalProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlobalProductController extends Controller
{
    /**
     * Search global product library by barcode or name.
     * Barcode takes priority — returns exact match or empty.
     * Name search returns up to 10 results.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'barcode' => ['sometimes', 'nullable', 'string', 'max:50'],
            'q' => ['sometimes', 'nullable', 'string', 'min:2', 'max:100'],
        ]);

        $barcode = $request->input('barcode');
        $query = $request->input('q');

        if ($barcode !== null && $barcode !== '') {
            $product = GlobalProduct::where('barcode', $barcode)
                ->with(['defaultCategory', 'defaultUnit'])
                ->first();

            return new JsonResponse($product !== null ? [$this->map($product)] : []);
        }

        if ($query !== null && $query !== '') {
            $results = GlobalProduct::where('name', 'like', '%'.$query.'%')
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
     * @return array<string, mixed>
     */
    private function map(GlobalProduct $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'brand' => $product->brand,
            'barcode' => $product->barcode,
            'image_url' => $product->image_url,
            'default_category_id' => $product->default_category_id,
            'default_unit_id' => $product->default_unit_id,
            'verified' => $product->verified,
            'scan_count' => $product->scan_count,
        ];
    }
}
