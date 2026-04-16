<?php

declare(strict_types=1);

namespace App\Filament\Resources\GlobalProducts\Schemas;

use App\Models\Category;
use App\Models\Unit;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class GlobalProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')
                ->required()
                ->maxLength(255),
            TextInput::make('brand')
                ->maxLength(255),
            TextInput::make('barcode')
                ->maxLength(50),
            Select::make('default_category_id')
                ->label(__('Default category'))
                ->options(
                    Category::where('is_global', true)
                        ->get()
                        ->mapWithKeys(fn (Category $c) => [$c->id => $c->name ?? "Category #{$c->id}"])
                )
                ->searchable()
                ->nullable(),
            Select::make('default_unit_id')
                ->label(__('Default unit'))
                ->options(
                    Unit::orderBy('type')->orderBy('symbol')
                        ->get()
                        ->mapWithKeys(fn (Unit $u) => [$u->id => "{$u->symbol} ({$u->type})"])
                )
                ->searchable()
                ->nullable(),
            Select::make('source')
                ->options([
                    'user_scan' => __('User scan'),
                    'open_food_facts' => __('Open Food Facts'),
                    'admin' => __('Admin'),
                ])
                ->required(),
            Toggle::make('verified')
                ->label(__('Verified')),
        ]);
    }
}
