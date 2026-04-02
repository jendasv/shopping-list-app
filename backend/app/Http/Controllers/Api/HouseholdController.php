<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\HouseholdRole;
use App\Enums\ShoppingListVisibility;
use App\Http\Controllers\Controller;
use App\Mapper\HouseholdMapper;
use App\Models\ShoppingList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HouseholdController extends Controller
{
    public function __construct(private readonly HouseholdMapper $householdMapper) {}

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $households = $user->households()->with('members')->get();

        $own = $households->first(fn ($h) => $h->pivot->role === HouseholdRole::Owner->value); // @phpstan-ignore-line
        $joined = $households->filter(fn ($h) => $h->pivot->role !== HouseholdRole::Owner->value)->values(); // @phpstan-ignore-line

        if (! $own) {
            return response()->json(['error' => 'No household found.'], 404);
        }

        return response()->json([
            'ownHousehold' => $this->householdMapper->map($own),
            'joinedHouseholds' => $joined->map(fn ($h) => $this->householdMapper->map($h))->values(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate(['name' => ['required', 'string', 'max:255']]);

        $user = $request->user();
        $household = $user->households()->wherePivot('role', HouseholdRole::Owner->value)->first();

        if (! $household) {
            return response()->json(['error' => 'No household found.'], 404);
        }

        $household->update(['name' => $request->name]);

        return response()->json([
            'household' => ['id' => $household->id, 'name' => $household->name],
        ]);
    }

    public function leave(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $household = $user->households()->wherePivot('role', HouseholdRole::Member->value)->where('households.id', $id)->first();

        if (! $household) {
            return response()->json(['error' => 'Household not found or you are not a member.'], 404);
        }

        $ownHousehold = $user->households()->wherePivot('role', HouseholdRole::Owner->value)->first();

        if ($ownHousehold) {
            ShoppingList::where('household_id', $household->id)
                ->where('created_by', $user->id)
                ->where('visibility', ShoppingListVisibility::Private->value)
                ->update(['household_id' => $ownHousehold->id]);

            $ownHousehold->update(['is_active' => true]);
        }

        $household->members()->detach($user->id);

        return response()->json(['message' => 'Left household successfully.']);
    }
}
