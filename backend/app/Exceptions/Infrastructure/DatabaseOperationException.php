<?php

declare(strict_types=1);

namespace App\Exceptions\Infrastructure;

use App\Exceptions\ApiException;

class DatabaseOperationException extends ApiException
{
    public function __construct(string $message)
    {
        parent::__construct($message, 500);
    }
}
