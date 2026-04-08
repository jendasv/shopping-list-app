<?php

namespace App\Filament\Resources\ShoppingLists\Pages;

use App\Filament\Resources\ShoppingLists\ShoppingListResource;
use Filament\Resources\Pages\CreateRecord;

class CreateShoppingList extends CreateRecord
{
    protected static string $resource = ShoppingListResource::class;
}
