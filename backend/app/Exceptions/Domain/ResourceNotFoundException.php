<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

use App\Exceptions\ApiException;

class ResourceNotFoundException extends ApiException
{
    public function __construct(string $message)
    {
        parent::__construct($message, 404);
    }
}
