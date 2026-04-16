<?php

declare(strict_types=1);

namespace App\Filament\Resources\Lists;

use App\Filament\Resources\Lists\Pages\CreateList;
use App\Filament\Resources\Lists\Pages\EditList;
use App\Filament\Resources\Lists\Pages\ListLists;
use App\Filament\Resources\Lists\Pages\ViewList;
use App\Filament\Resources\Lists\RelationManagers\ItemsRelationManager;
use App\Filament\Resources\Lists\Schemas\ListForm;
use App\Filament\Resources\Lists\Schemas\ListInfolist;
use App\Filament\Resources\Lists\Tables\ListsTable;
use App\Models\Liste;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ListResource extends Resource
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
        return ListForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ListInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ListsTable::configure($table);
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
            'index' => ListLists::route('/'),
            'create' => CreateList::route('/create'),
            'view' => ViewList::route('/{record}'),
            'edit' => EditList::route('/{record}/edit'),
        ];
    }
}
