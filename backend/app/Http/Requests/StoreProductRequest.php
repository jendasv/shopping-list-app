<?php

declare(strict_types=1);

namespace App\Http\Requests;

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
}
