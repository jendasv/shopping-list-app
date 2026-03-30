<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

use App\Exceptions\ApiException;

class ValidationException extends ApiException
{
    /**
     * @param  array<string, string>  $details
     */
    public function __construct(string $message, private readonly array $details = [])
    {
        parent::__construct($message, 400);
    }

    /**
     * @return array<string, string>
     */
    public function getDetails(): array
    {
        return $this->details;
    }
}
