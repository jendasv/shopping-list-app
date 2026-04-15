<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $code
 * @property string $name_native
 * @property string|null $flag_emoji
 * @property bool $is_active
 */
class Language extends Model
{
    protected $fillable = ['code', 'name_native', 'flag_emoji', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}
