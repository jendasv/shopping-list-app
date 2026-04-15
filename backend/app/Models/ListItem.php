<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ListItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $list_id
 * @property string $name
 * @property float|null $quantity
 * @property int|null $unit_id
 * @property bool $is_completed
 * @property int $sort_order
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ListItem extends Model
{
    /** @use HasFactory<ListItemFactory> */
    use HasFactory;

    protected $table = 'list_items';

    protected $fillable = ['name', 'quantity', 'is_completed', 'list_id', 'unit_id', 'notes', 'sort_order'];

    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
            'quantity' => 'float',
        ];
    }

    /** @return BelongsTo<Liste, $this> */
    public function list(): BelongsTo
    {
        return $this->belongsTo(Liste::class, 'list_id');
    }

    /** @return BelongsTo<Unit, $this> */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
