<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ListeFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Note: PHP reserves 'list' as a keyword — class is named Liste, table is 'lists'.
 *
 * @property int $id
 * @property int|null $household_id
 * @property int|null $created_by
 * @property string $name
 * @property string $list_type shopping | packing | todo
 * @property string $status active | completed | archived
 * @property string $visibility
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Collection<int, ListItem> $items
 * @property int|null $user_sort_order virtual — set via LEFT JOIN in getAllLists or manually after createList
 */
class Liste extends Model
{
    /** @use HasFactory<ListeFactory> */
    use HasFactory;

    protected $table = 'lists';

    protected $fillable = ['name', 'list_type', 'status', 'household_id', 'created_by', 'visibility'];

    /** @return HasMany<ListItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(ListItem::class, 'list_id');
    }

    /** @return BelongsTo<Household, $this> */
    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
