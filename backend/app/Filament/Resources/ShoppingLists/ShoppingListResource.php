<?php

declare(strict_types=1);

namespace App\Filament\Resources\ShoppingLists;

use App\Filament\Resources\ShoppingLists\Pages\CreateShoppingList;
use App\Filament\Resources\ShoppingLists\Pages\EditShoppingList;
use App\Filament\Resources\ShoppingLists\Pages\ListShoppingLists;
use App\Filament\Resources\ShoppingLists\Pages\ViewShoppingList;
use App\Filament\Resources\ShoppingLists\RelationManagers\ItemsRelationManager;
use App\Filament\Resources\ShoppingLists\Schemas\ShoppingListForm;
use App\Filament\Resources\ShoppingLists\Schemas\ShoppingListInfolist;
use App\Filament\Resources\ShoppingLists\Tables\ShoppingListsTable;
use App\Models\Liste;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ShoppingListResource extends Resource
{
    protected static ?string $model = Liste::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function getModelLabel(): string
    {
        return __('Shopping List');
    }

    public static function getPluralModelLabel(): string
    {
        return __('Shopping Lists');
    }

    public static function form(Schema $schema): Schema
    {
        return ShoppingListForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ShoppingListInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ShoppingListsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            ItemsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListShoppingLists::route('/'),
            'create' => CreateShoppingList::route('/create'),
            'view' => ViewShoppingList::route('/{record}'),
            'edit' => EditShoppingList::route('/{record}/edit'),
        ];
    }
}
