<?php

declare(strict_types=1);

namespace App\Filament\Resources\Lists\Pages;

use App\Filament\Resources\Lists\ListResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLists extends ListRecords
{
    protected static string $resource = ListResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
