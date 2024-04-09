<?php

namespace Database\Factories;
use \App\Models\UserProjects;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class UserProjectsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = UserProjects::class;
    public function definition()
    {
        return [
            'Project Title' => $this->faker->name(),
            'Technology Used' => json_encode($this->faker->randomElements(['PHP', 'Javascript', 'Python', 'Laravel', 'MongoDb', 'Expressjs', 'Reactjs', 'Nodejs', 'C++', 'Django'], $this->faker->numberBetween(1, 10))),
            'Project Description' => $this->faker->paragraph(), 
            'user_id' => \App\Models\User::factory()->create()->id,
        ];
    }
}
