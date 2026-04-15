<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class UpdateListItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'quantity' => ['sometimes', 'nullable', 'numeric', 'min:0.01'],
            'unit_id' => ['sometimes', 'nullable', 'integer', 'exists:units,id'],
            'isCompleted' => ['sometimes', 'boolean'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:500'],
        ];
    }

    protected function failedValidation(Validator $validator): never
    {
        throw new HttpResponseException(
            new JsonResponse(
                ['error' => 'Validation failed.', 'details' => $validator->errors()->toArray()],
                400,
            )
        );
    }
}
