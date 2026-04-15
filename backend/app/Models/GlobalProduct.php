<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string|null $barcode
 * @property string $name
 * @property string|null $brand
 * @property int|null $default_category_id
 * @property int|null $default_unit_id
 * @property string|null $image_url
 * @property string $source user_scan | open_food_facts | admin
 * @property bool $verified
 * @property int $scan_count
 */
class GlobalProduct extends Model
{
    protected $fillable = [
        'barcode', 'name', 'brand', 'default_category_id',
        'default_unit_id', 'image_url', 'source', 'verified', 'scan_count',
    ];

    protected function casts(): array
    {
        return ['verified' => 'boolean'];
    }

    /** @return BelongsTo<Category, $this> */
    public function defaultCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'default_category_id');
    }

    /** @return BelongsTo<Unit, $this> */
    public function defaultUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'default_unit_id');
    }
}
