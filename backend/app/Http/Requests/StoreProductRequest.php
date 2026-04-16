<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class StoreProductRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
            'preferred_unit_id' => ['sometimes', 'nullable', 'integer', 'exists:units,id'],
            'preferred_quantity' => ['sometimes', 'nullable', 'numeric', 'min:0.01'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:500'],
            'barcode' => ['sometimes', 'nullable', 'string', 'max:50'],
            'global_product_id' => ['sometimes', 'nullable', 'integer', 'exists:global_products,id'],
        ];
    }

    protected function failedValidation(Validator $validator): never
    {
        throw new HttpResponseException(
            new JsonResponse(
                ['error' => 'Validation failed.', 'details' => $validator->errors()->toArray()],
                422,
            )
        );
    }
}
