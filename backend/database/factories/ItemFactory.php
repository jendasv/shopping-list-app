<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Item>
 */
class ItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'quantity' => fake()->numberBetween(1, 10),
            'is_completed' => false,
            'shopping_list_id' => null,
            'sort_order' => 0,
        ];
    }
}
