<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $household_id
 * @property int|null $created_by
 * @property int|null $global_product_id
 * @property int|null $category_id
 * @property int|null $preferred_unit_id
 * @property string $name
 * @property string|null $barcode
 * @property float|null $preferred_quantity
 * @property string|null $notes
 * @property Carbon|null $deleted_at
 */
class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'household_id',
        'created_by',
        'global_product_id',
        'category_id',
        'preferred_unit_id',
        'name',
        'barcode',
        'preferred_quantity',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'preferred_quantity' => 'float',
        ];
    }

    /** @return BelongsTo<Household, $this> */
    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    /** @return BelongsTo<Category, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** @return BelongsTo<Unit, $this> */
    public function preferredUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'preferred_unit_id');
    }

    /** @return BelongsTo<GlobalProduct, $this> */
    public function globalProduct(): BelongsTo
    {
        return $this->belongsTo(GlobalProduct::class);
    }
}
