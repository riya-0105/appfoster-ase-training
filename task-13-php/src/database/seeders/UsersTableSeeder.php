<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		User::create([
            'name' => 'Admin',
            'username' => 'admin',
			'password' => Hash::make('admin'),
            'email' => 'admin@example.com'
        ]);
    }
}
