<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Item>
 *
 * @deprecated Use ListItemFactory instead.
 */
class ItemFactory extends Factory
{
    protected $model = Item::class;

    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'quantity' => fake()->numberBetween(1, 10),
            'is_completed' => false,
            'list_id' => null,
            'unit_id' => null,
            'notes' => null,
            'sort_order' => 0,
        ];
    }
}
