<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Household;
use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShoppingList>
 */
class ShoppingListFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'visibility' => 'shared',
            'household_id' => null,
            'created_by' => null,
        ];
    }
}
