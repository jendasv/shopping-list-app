<?php

declare(strict_types=1);

namespace App\Http\Requests;

class StoreListItemRequest extends FormRequest
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
            'product_id' => ['sometimes', 'nullable', 'integer', 'exists:products,id'],
            'name' => ['required_without:product_id', 'nullable', 'string', 'max:255'],
            'quantity' => ['sometimes', 'nullable', 'numeric', 'min:0.01'],
            'unit_id' => ['sometimes', 'nullable', 'integer', 'exists:units,id'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:500'],
        ];
    }
}
