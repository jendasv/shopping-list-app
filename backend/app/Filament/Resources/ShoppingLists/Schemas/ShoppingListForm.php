<?php

declare(strict_types=1);

namespace App\Filament\Resources\ShoppingLists\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ShoppingListForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('household_id')
                    ->relationship('household', 'name'),
                TextInput::make('created_by')
                    ->numeric(),
                TextInput::make('name')
                    ->required(),
                Select::make('visibility')
                    ->options(['shared' => __('Shared'), 'private' => __('Private')])
                    ->default('shared')
                    ->required(),
            ]);
    }
}
