<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int|null $household_id
 * @property bool $is_global
 * @property string|null $name Only for custom household categories
 * @property int $sort_order
 * @property string|null $translated_name virtual — set by withTranslation() scope
 */
class Category extends Model
{
    protected $fillable = ['household_id', 'is_global', 'name', 'sort_order'];

    protected function casts(): array
    {
        return ['is_global' => 'boolean'];
    }

    /** @return BelongsTo<Household, $this> */
    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    /** @return HasMany<CategoryTranslation, $this> */
    public function translations(): HasMany
    {
        return $this->hasMany(CategoryTranslation::class);
    }

    /**
     * Scope: JOIN category_translations for given language code (only for global categories).
     *
     * @param  Builder<Category>  $query
     */
    public function scopeWithTranslation(Builder $query, string $langCode = 'en'): void
    {
        $query->leftJoinSub(
            \DB::table('category_translations')
                ->join('languages', 'languages.id', '=', 'category_translations.lang_id')
                ->where('languages.code', $langCode)
                ->select('category_translations.category_id', 'category_translations.value as translated_name'),
            'ct',
            'ct.category_id',
            '=',
            'categories.id'
        )->addSelect('categories.*', \DB::raw('COALESCE(ct.translated_name, categories.name) as translated_name'));
    }
}
