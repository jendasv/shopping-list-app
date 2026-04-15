<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Liste;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Liste>
 */
class ListeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'list_type' => 'shopping',
            'status' => 'active',
            'visibility' => 'shared',
            'household_id' => null,
            'created_by' => null,
        ];
    }
}
