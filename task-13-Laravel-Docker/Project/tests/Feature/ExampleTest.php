<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\UserProjects;
class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_the_application_returns_a_successful_response()
    {
        $response = $this->get('/create_user');
        $response->assertSee('button');
        $response->assertStatus(200);
    }

    public function test_response_redirects_to_create_user_project_response()
    {
        // test for user creation, show responses
        $id = 14;
        $user = User::class;
        //show data response
        $response = $this->get('/api/host/users/show_user_info/'.$id);
        $response->assertStatus(200)
        ->assertJson([
            "id"=> 14,
            "name"=> "Kenyatta Hermiston MD",
            "email"=> "vstroman@example.com",
            "gender"=> "Other",
            "status"=> "Active",
            "created_at"=> "2024-04-08T08:29:31.000000Z",
            "updated_at"=> "2024-04-08T08:29:31.000000Z"
        ]);

        // to check values in database
        $this->assertDatabaseHas('users', [
            'email' => 'vstroman@example.com',
        ]);
        $this->assertDatabaseMissing('users', [
            'email' => '49@example.com',
        ]);

        // for sending data to the api
        $response_request = $this->json('POST', '/create_user', [
            "name"=> "Rab",
            "email"=> "rab@example.com",
            "gender"=> "Other",
            "status"=> "Active",
        ]);
        $this->assertDatabaseHas('users', [
            'email' => 'rab@example.com',
        ]);
        // $this->assertSoftDeleted($users);

        // test for project creation, show responses

        // this is risky as this url redirects to view as response
        $project_id = 10;
        // $project = UserProjects::class;
        // $response = $this->get('/project');
        // $response->assertStatus(200);

        // project creation and show test

        // create project

        $response = $this->json('POST', '/api/host/create_project', [
            "Project Title" => "Blockchain Psycological health Clinic App",
            "Technology Used" => ["PHP", "Python", "Javascript", "machine learning", "blockchain"],
            "Project Description" => "The field of psychological health focuses on emotional, cognitive, behavioral, and social well-being. Like physical health, psychological health is an integral part of our overall holistic wellness. Healthy psychological well-being is not just the absence of signs of mental health issues or a diagnosis of a mental health disorder, but the presence of balanced emotions, thoughts, and behaviors. When our psychological state is unbalanced, we may have trouble with indecisiveness, managing our emotions, controlling our behaviors, interacting with others, and handling stress and other challenges ",
            "user_id" => 63
        ]);
        $response->assertStatus(200);

        $this->assertDatabaseHas('user_projects', [
            'user_id' => 63,
        ]);
        // listing all projects
        $response = $this->get('/api/host/get_projects');
        $response->assertStatus(200);

        //show particular project
        $response = $this->get('/api/host/show_project/'.$id);
        $response->assertStatus(200);

        // database has
        $this->assertDatabaseHas('user_projects', [
            'id' => 11,
        ]);



    }

    public function test_response_redirects_to_delete_user_project_response() {
        //user delete test 
        $id = 3;
        $response = $this->json('POST', '/api/host/delete_user/'.$id);
        $response->assertStatus(200)
        ->assertJson([
            "error" => "Cannot delete due to foreign key constraint"
        ]);

        // project delete test
        $id = 16;
        $response = $this->json('POST', '/api/host/delete_project/'.$id);
        $response->assertStatus(404)
        ->assertJson([
            "error" => "Project not found"
        ]);

    }

    public function test_response_redirects_to_db_user_project_response()
    {
        // creating dummy user
        $user = User::factory()->create();
        $response = $this->get('/api/host/users/show_user_info/'.$user->id);
        $response->dump();
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'name' => $user->name,
            'email' => $user->email,
        ]);

        //creating dummy project
        $projects = UserProjects::factory()->create();
        $response = $this->get('/api/host/show_project/'.$projects->id);
        $response->dump();
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'Project Title' => $projects['Project Title'],
        ]);
    }

    public function test_response_redirects_to_edit_user_project_response() {
        // edit tests for users
        $user = User::factory()->create();
        dump($user);
        $response = $this->json('POST', '/api/host/modify_userInfo', [
            "email" => $user->email,
            "status" => "Active",
        ]);
        dump($response);
        $response->assertStatus(200);

        // edit tests for project
        $project = UserProjects::factory()->create();
        dump($project);
        $response = $this->json('POST', '/api/host/modify_projects/'.$project->id, [
            "Technology Used" => ["Javascript", "Django", "MongoDb", "Reactjs", "Laravel", "PHP", "Nodejs", "C++", "CSS"],
            "Project Description" => "Doraemon is a blue cat robot came from 21th Century to save Nobita-Nobi life's to save him, However Nobita-Nobi became very lazy after Doraemon arrives to him he always took gadgets and take revenge from Suneo and Gian. Some of peoples call Doraemon a racoon dog, and Doraemon always shouts and says \"I'M NOT A RACOON DOG I'M A CAT ROBOT DORAEMON!\" and Suneo-Gian-Nobita always makes fun of it. Doraemon most used gadget is Bamboo Coopter, Sincerly, Doraemon most of the favourite food of time is Doracakes (Bim Jam Cakes) He eats a lot of Doracakes. DORAEMON WAS INVENTED IN JAPAN AND MOSTLY FAMOUS IN INDIA."
        ]);
        dump($response);
        $response->assertStatus(200);

    }
}
