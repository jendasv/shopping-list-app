<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\HouseholdRole;
use App\Models\Household;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'jendasv@seznam.cz'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'is_super_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        // Vytvoř household pokud ještě nemá
        if ($user->households()->count() === 0) {
            $household = Household::create(['name' => "Admin's household", 'owner_id' => $user->id]);
            $household->members()->attach($user->id, ['role' => HouseholdRole::Owner->value]);
        }

        $this->command->info("Super admin ready: admin@example.com / password");
    }
}
