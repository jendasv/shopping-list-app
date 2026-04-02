<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Models\Household;

class HouseholdMapper
{
    /**
     * @return array<string, mixed>
     */
    public function map(Household $household): array
    {
        return [
            'id' => $household->id,
            'name' => $household->name,
            'isActive' => $household->is_active,
            'members' => $household->members->map(fn ($member) => [
                'id' => $member->id,
                'name' => $member->name,
                'email' => $member->email,
                // @phpstan-ignore-next-line
                'role' => $member->pivot->role,
            ])->values()->all(),
        ];
    }
}
