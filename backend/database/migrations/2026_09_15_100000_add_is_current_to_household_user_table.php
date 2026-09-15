<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * `households.is_active` used to double as "which household is this user
     * currently using" — but it lives on the shared household row, not per
     * membership, so activating one household for one user silently
     * deactivated it for every other member. The per-user "current
     * household" selection belongs on the membership (household_user), not
     * on the household itself.
     */
    public function up(): void
    {
        Schema::table('household_user', function (Blueprint $table) {
            $table->boolean('is_current')->default(false)->after('role');
        });

        // Backfill: each user's own (owned) household becomes their current one.
        DB::table('household_user')->where('role', 'owner')->update(['is_current' => true]);

        // Any user without an owner row (shouldn't normally happen) keeps
        // their earliest membership as current, so household() never returns null
        // for a user who has at least one membership.
        $usersWithoutCurrent = DB::table('household_user')
            ->select('user_id')
            ->groupBy('user_id')
            ->havingRaw('bool_or(is_current) = false')
            ->pluck('user_id');

        foreach ($usersWithoutCurrent as $userId) {
            $firstRowId = DB::table('household_user')
                ->where('user_id', $userId)
                ->orderBy('id')
                ->value('id');

            DB::table('household_user')->where('id', $firstRowId)->update(['is_current' => true]);
        }

        // Enforce at the DB level that a user has at most one current household.
        DB::statement('CREATE UNIQUE INDEX household_user_one_current_per_user ON household_user (user_id) WHERE is_current = true');
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS household_user_one_current_per_user');

        Schema::table('household_user', function (Blueprint $table) {
            $table->dropColumn('is_current');
        });
    }
};
