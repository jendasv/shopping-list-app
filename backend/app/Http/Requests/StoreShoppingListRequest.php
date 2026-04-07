<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\ShoppingListVisibility;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rules\Enum;

class StoreShoppingListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'visibility' => ['sometimes', new Enum(ShoppingListVisibility::class)],
            'items' => ['sometimes', 'array'],
            'items.*.name' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
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
