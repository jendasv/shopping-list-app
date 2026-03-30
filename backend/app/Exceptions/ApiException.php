<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

abstract class ApiException extends RuntimeException
{
    public function __construct(string $message, private readonly int $statusCode)
    {
        parent::__construct($message);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }
}
