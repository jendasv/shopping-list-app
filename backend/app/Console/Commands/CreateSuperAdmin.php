<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateSuperAdmin extends Command
{
    protected $signature = 'admin:create {email} {--name=} {--password=}';

    protected $description = 'Grant superadmin access to an existing user, or create a new superadmin account';

    public function handle(): int
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if ($user) {
            $user->update(['is_super_admin' => true, 'is_active' => true]);
            $this->info("User {$user->name} ({$email}) is now a superadmin.");

            return self::SUCCESS;
        }

        $name = $this->option('name') ?? $this->ask('Name');
        $password = $this->option('password') ?? $this->secret('Password');

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make((string) $password),
            'is_super_admin' => true,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $this->info("Superadmin {$user->name} ({$email}) created successfully.");

        return self::SUCCESS;
    }
}
