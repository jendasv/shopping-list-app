<?php

declare(strict_types=1);

namespace App\Filament\Resources\Households\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class HouseholdForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('owner_id')
                    ->numeric(),
                TextInput::make('name')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
