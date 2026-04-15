<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ShoppingList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShoppingList>
 *
 * @deprecated Use ListeFactory instead.
 */
class ShoppingListFactory extends ListeFactory
{
    protected $model = ShoppingList::class;
}
