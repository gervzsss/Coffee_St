<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create an admin user if one doesn't exist
        $admin = User::firstOrCreate(
            ['email' => 'admin@coffeest.com'],
            [
                'first_name' => 'Admin',
                'last_name' => 'User',
                'password' => Hash::make('admin'),
                'is_admin' => true,
            ]
        );

        // Generate a Sanctum personal access token for the admin user
        $token = $admin->createToken('auth_token')->plainTextToken;

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@coffeest.com');
        $this->command->info('Password: admin');
        $this->command->info('Personal Access Token: '.$token);
    }
}
