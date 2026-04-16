<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    /**
     * Return all units grouped by type, translated for the user's locale.
     */
    public function index(Request $request): JsonResponse
    {
        $locale = $request->user()->preferredLocale();

        $units = Unit::withTranslation($locale)
            ->orderBy('type')
            ->orderBy('symbol')
            ->get();

        $grouped = $units->groupBy('type')->map(fn ($group) => $group->map(fn (Unit $u) => [
            'id' => $u->id,
            'symbol' => $u->symbol,
            'name' => $u->translated_name ?? $u->symbol,
        ])->values()->all());

        return new JsonResponse($grouped);
    }
}
