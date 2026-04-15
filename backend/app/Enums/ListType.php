<?php

declare(strict_types=1);

namespace App\Enums;

enum ListType: string
{
    case Shopping = 'shopping';
    case Packing = 'packing';
    case Todo = 'todo';
}
