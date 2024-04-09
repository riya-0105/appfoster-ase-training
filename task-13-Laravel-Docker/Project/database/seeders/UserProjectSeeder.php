<?php

namespace Database\Seeders;
use App\Models\UserProjects;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run():void
    {
        UserProjects::factory()
        ->count(10)
        ->has(User::factory()->count(1))
        ->create();
    }
}
