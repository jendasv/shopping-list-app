<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class CategoryController extends Controller
{
    /**
     * Return all categories visible to the user's household:
     * - global categories (with translation for user's locale)
     * - household's own custom categories
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $household = $user->household();
        $locale = $user->preferredLocale();

        // Global categories with translation
        $global = Category::withTranslation($locale)
            ->where('is_global', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->translated_name ?? $c->name,
                'is_global' => true,
            ]);

        // Household custom categories
        $custom = [];
        if ($household !== null) {
            $custom = Category::where('household_id', $household->id)
                ->where('is_global', false)
                ->orderBy('name')
                ->get()
                ->map(fn (Category $c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'is_global' => false,
                ])
                ->all();
        }

        return new JsonResponse([
            'global' => $global->all(),
            'custom' => $custom,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $household = $request->user()->household();

        if ($household === null) {
            return new JsonResponse(['error' => 'No active household.'], 422);
        }

        try {
            $category = Category::create([
                'household_id' => $household->id,
                'is_global' => false,
                'name' => $request->string('name')->toString(),
                'sort_order' => 0,
            ]);
        } catch (Throwable $e) {
            return new JsonResponse(['error' => 'Failed to create category.'], 500);
        }

        return new JsonResponse(['id' => $category->id, 'name' => $category->name, 'is_global' => false], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $household = $request->user()->household();

        $category = Category::where('id', $id)
            ->where('household_id', $household?->id)
            ->where('is_global', false)
            ->first();

        if ($category === null) {
            return new JsonResponse(['error' => 'Category not found.'], 404);
        }

        $category->name = $request->string('name')->toString();
        $category->save();

        return new JsonResponse(['id' => $category->id, 'name' => $category->name, 'is_global' => false]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $household = $request->user()->household();

        $category = Category::where('id', $id)
            ->where('household_id', $household?->id)
            ->where('is_global', false)
            ->first();

        if ($category === null) {
            return new JsonResponse(['error' => 'Category not found.'], 404);
        }

        // Detach products before deleting category
        DB::table('products')
            ->where('category_id', $id)
            ->where('household_id', $household->id)
            ->update(['category_id' => null]);

        $category->delete();

        return new JsonResponse(null, 204);
    }
}
