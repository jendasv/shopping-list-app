<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\ListVisibility;
use Illuminate\Validation\Rules\Enum;

class UpdateListRequest extends FormRequest
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
            'visibility' => ['sometimes', new Enum(ListVisibility::class)],
        ];
    }
}
