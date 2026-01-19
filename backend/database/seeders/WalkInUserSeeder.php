<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class WalkInUserSeeder extends Seeder
{
    /**
     * Create or update the walk-in customer user for POS orders.
     * 
     * This user acts as a placeholder for all POS orders where
     * the customer doesn't have an account. Individual customer
     * details can be stored in pos_customer_name and pos_customer_phone
     * on the order itself.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'walkin@coffeest.local'],
            [
                'first_name' => 'Walk-in',
                'last_name' => 'Customer',
                'password' => Hash::make('not-a-real-password-' . uniqid()),
                'is_admin' => false,
                'status' => 'active',
                'phone' => null,
                'address' => null,
            ]
        );

        $this->command->info('Walk-in customer user created/updated successfully.');
    }
}
