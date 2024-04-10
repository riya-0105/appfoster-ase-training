<?php

namespace Tests\Unit;
use App\Models\User;
use App\Models\UserProjects;
use Tests\TestCase;

class projectTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_the_application_returns_a_successful_response_project()
    {
        // $response = $this->get('/create-project');
        // $response->assertStatus(200);
    }

    public function test_response_redirects_to_db_project_response()
    {

        //creating dummy project
        $projects = UserProjects::factory()->create();
        $response = $this->get('/api/show-project/'.$projects->id);
        $response->dump();
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'Project Title' => $projects['Project Title'],
        ]);
        $this->assertDatabaseHas('user_projects', [
            'Project Title' => $projects['Project Title'],
        ]);
    }
    public function test_response_redirects_to_create_project_response()
    {
        // test for user creation, show responses
        // listing all projects
        $projects = UserProjects::factory()->create();
        $response = $this->get('/api/get-projects');
        $response->assertStatus(200);

        //show particular project
        $response = $this->get('/api/show-project/'.$projects->id);
        $response->assertStatus(200);

        // database has
        $this->assertDatabaseHas('user_projects', [
            'id' => $projects->id,
        ]);

    }

    public function test_response_redirects_to_delete_project_response() {
        //user delete test 
        $projects = UserProjects::factory()->create();
        $response = $this->json('POST', '/api/delete-project/'.$projects->id);
        $response->assertStatus(200);
    }

    

    public function test_response_redirects_to_edit_project_response() {

        // edit tests for project
        $project = UserProjects::factory()->create();
        dump($project);
        $response = $this->json('POST', '/api/modify-projects/'.$project->id, [
            "Technology Used" => ["Javascript", "Django", "MongoDb", "Reactjs", "Laravel", "PHP", "Nodejs", "C++", "CSS"],
            "Project Description" => "Doraemon is a blue cat robot came from 21th Century to save Nobita-Nobi life's to save him, However Nobita-Nobi became very lazy after Doraemon arrives to him he always took gadgets and take revenge from Suneo and Gian. Some of peoples call Doraemon a racoon dog, and Doraemon always shouts and says \"I'M NOT A RACOON DOG I'M A CAT ROBOT DORAEMON!\" and Suneo-Gian-Nobita always makes fun of it. Doraemon most used gadget is Bamboo Coopter, Sincerly, Doraemon most of the favourite food of time is Doracakes (Bim Jam Cakes) He eats a lot of Doracakes. DORAEMON WAS INVENTED IN JAPAN AND MOSTLY FAMOUS IN INDIA."
        ]);
        dump($response);
        $response->assertStatus(200);

    }
}
