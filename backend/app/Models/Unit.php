<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $symbol
 * @property string $type weight | volume | count | piece
 * @property string|null $translated_name virtual — set by withTranslation() scope
 */
class Unit extends Model
{
    protected $fillable = ['symbol', 'type'];

    /** @return HasMany<UnitTranslation, $this> */
    public function translations(): HasMany
    {
        return $this->hasMany(UnitTranslation::class);
    }

    /**
     * Scope: JOIN unit_translations for given language code, fallback to 'en'.
     *
     * @param  Builder<Unit>  $query
     */
    public function scopeWithTranslation(Builder $query, string $langCode = 'en'): void
    {
        $query->leftJoinSub(
            \DB::table('unit_translations')
                ->join('languages', 'languages.id', '=', 'unit_translations.lang_id')
                ->where('languages.code', $langCode)
                ->select('unit_translations.unit_id', 'unit_translations.value as translated_name'),
            'ut',
            'ut.unit_id',
            '=',
            'units.id'
        )->addSelect('units.*', 'ut.translated_name');
    }
}
