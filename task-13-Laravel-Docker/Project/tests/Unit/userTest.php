<?php

namespace Tests\Unit;
use App\Models\User;
use App\Models\UserProjects;
use Tests\TestCase;

class userTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_the_application_returns_a_successful_response_user()
    {
        // $response = $this->get('/create-user');
        // $response->assertSee('button');
        // $response->assertStatus(200);
    }

    public function test_response_redirects_to_create_user_response()
    {
        // test for user creation, show responses
        $user = User::factory()->create();
        //show data response
        $response = $this->get('/api/users/show-user-info/'.$user->id);
        $response->assertStatus(200)
        ->assertJsonFragment([
            "id"=> $user->id,
            "name"=> $user->name,
            "email"=> $user->email,
            "gender"=> $user->gender,
            "status"=> $user->status,
            "created_at"=> $user->created_at,
            "updated_at"=> $user->updated_at, 
            "deleted_at" => $user->deleted_at
        ]);

        // to check values in database
        $this->assertDatabaseHas('users', [
            'email' => $user->email,
        ]);

        $user = User::factory()->create();
        // for sending data to the api
        $this->assertDatabaseHas('users', [
            'email' => $user->email,
        ]);
    }

    public function test_response_redirects_to_delete_user_response() {
        //user delete test 
        $user = User::factory()->create();
        $response = $this->json('POST', '/api/delete-user/'.$user->id);
        $response->assertStatus(200);

    }

    public function test_response_redirects_to_db_user_response()
    {
        // creating dummy user
        $user = User::factory()->create();
        $response = $this->get('/api/users/show-user-info/'.$user->id);
        $response->dump();
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'name' => $user->name,
            'email' => $user->email,
        ]);

    }

    public function test_response_redirects_to_edit_user_response() {
        // edit tests for users
        $user = User::factory()->create();
        dump($user);
        $response = $this->json('POST', '/api/modify-userInfo', [
            "email" => $user->email,
            "status" => "Active",
        ]);
        dump($response);
        $response->assertStatus(200);

    }
}
