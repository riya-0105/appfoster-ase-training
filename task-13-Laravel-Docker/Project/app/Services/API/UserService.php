<?php

namespace App\Services\API;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserProjects;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;

class UserService {

    // function to show all users
    public function index()
    {
        try {
            $userData = User::all();
            // $data = response()->json($users);
            // return view('welcome', compact('data'));
            return response()->json($userData);
        }
        catch (Exception $e) {
            return response()->json(['error' => 'No data found'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    // api to store the user information
    // to store new user
    public function store(Request $request)
    {
        try {
            $newUser = new User();
            $newUser->name = $request->input('name');
            $newUser->email = $request->input('email');
            $newUser->gender = $request->input('gender');
            $newUser->status = $request->input('status');
            $newUser->save();
        } catch(QueryException $e) {
            // Log::error($e->getMessage());
            return response()->json(['Error', 'No data passed'], 500);
        }
        catch(Exception $e) {
            // Log::error($e->getMessage());
            return response()->json(['Error', 'Unknown error'], 500);
        }
        // dd($newUser);
        return response()->json($newUser);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    // api to display the data
    public function show($id)
    {
        try {
            $userData = User::findOrFail($id);
            return response()->json($userData);
        }
        catch(ModelNotFoundException $e) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    // api to update the data
    public function update(Request $request)
    {
        try {
            $newUser = User::where('email', $request->input('email'))
            ->firstOrFail();
            $user_data = $request->except(['email']);
            $newUser['name'] = isset($user_data['name']) ? $user_data['name'] : $newUser['name'];
            $newUser['gender'] = isset($user_data['gender']) ? $user_data['gender'] : $newUser['gender'];
            $newUser['status'] = isset($user_data['status']) ? $user_data['status'] : $newUser['status'];
            $newUser->save();
        }
        catch (QueryException $e) {
            return response()->json(['error' => 'User not found'], 404);
        }
        catch (Exception $e) {
            return response()->json(['error' => 'Unknown error occured'], 500);
        }
        return response()->json($newUser);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    // api to delete the data
    public function destroy($id)
    {
        try {
            $newUserProject = UserProjects::where("user_id", $id)->exists();
            if($newUserProject) {
                return response()->json(["error" => "Cannot delete due to foreign key constraint"]);
            }
            $newUser = User::findOrFail($id);
            $newUser->delete();
            return response()->json("User deleted successfully");
        } catch(ModelNotFoundException $e) {
            return response()->json(["error" => "User not Found"], 404);
        }
        catch(Exception $e) {
            return response()->json(["error" => "Failed to delete User"], 500);
        }
    }
    
}