<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ShoppingListFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $household_id
 * @property int|null $created_by
 * @property string $name
 * @property string $visibility
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Collection<int, Item> $items
 * @property int|null $user_sort_order virtual — set via LEFT JOIN in getAllLists or manually after createList
 */
class ShoppingList extends Model
{
    /** @use HasFactory<ShoppingListFactory> */
    use HasFactory;

    protected $table = 'shopping_list';

    protected $fillable = ['name', 'household_id', 'created_by', 'visibility'];

    /** @return HasMany<Item, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
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
