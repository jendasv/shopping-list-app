<?php

namespace App\Filament\Resources\ShoppingLists\Pages;

use App\Filament\Resources\ShoppingLists\ShoppingListResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListShoppingLists extends ListRecords
{
    protected static string $resource = ShoppingListResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
