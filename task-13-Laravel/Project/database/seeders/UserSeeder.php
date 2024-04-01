<?php

namespace Database\Seeders;
use App\Models\User;
use App\Models\UserProjects;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        User::factory()
        ->count(10)
        ->has(UserProjects::factory()->count(rand(1, 10)))
        ->create();
    }
}
