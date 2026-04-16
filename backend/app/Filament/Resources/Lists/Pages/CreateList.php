<?php

declare(strict_types=1);

namespace App\Filament\Resources\Lists\Pages;

use App\Filament\Resources\Lists\ListResource;
use Filament\Resources\Pages\CreateRecord;

class CreateList extends CreateRecord
{
    protected static string $resource = ListResource::class;
}
