<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\ListType;
use App\Enums\ListVisibility;
use Illuminate\Validation\Rules\Enum;

class StoreListRequest extends FormRequest
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
            'list_type' => ['sometimes', new Enum(ListType::class)],
            'visibility' => ['sometimes', new Enum(ListVisibility::class)],
            'items' => ['sometimes', 'array'],
            'items.*.name' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}
