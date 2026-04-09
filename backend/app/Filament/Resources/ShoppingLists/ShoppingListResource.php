<?php

declare(strict_types=1);

namespace App\Filament\Resources\ShoppingLists;

use App\Filament\Resources\ShoppingLists\Pages\CreateShoppingList;
use App\Filament\Resources\ShoppingLists\Pages\EditShoppingList;
use App\Filament\Resources\ShoppingLists\Pages\ListShoppingLists;
use App\Filament\Resources\ShoppingLists\Schemas\ShoppingListForm;
use App\Filament\Resources\ShoppingLists\Tables\ShoppingListsTable;
use App\Models\ShoppingList;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ShoppingListResource extends Resource
{
    protected static ?string $model = ShoppingList::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ShoppingListForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ShoppingListsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListShoppingLists::route('/'),
            'create' => CreateShoppingList::route('/create'),
            'edit' => EditShoppingList::route('/{record}/edit'),
        ];
    }
}
