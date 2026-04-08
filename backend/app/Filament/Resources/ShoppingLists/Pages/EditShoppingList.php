<?php

namespace App\Filament\Resources\ShoppingLists\Pages;

use App\Filament\Resources\ShoppingLists\ShoppingListResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditShoppingList extends EditRecord
{
    protected static string $resource = ShoppingListResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
