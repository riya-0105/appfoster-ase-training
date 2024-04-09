<?php

namespace App\Http\Controllers\Api\v1;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserProjects;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;


class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    //api to fetch all users info
    public function index()
    {
        try {
            $users = User::all();
            // $data = response()->json($users);
            // return view('welcome', compact('data'));
            return response()->json($users);
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
    public function store(Request $request)
    {
        try {
            $newuser = new User();
            $newuser->name = $request->input('name');
            $newuser->email = $request->input('email');
            $newuser->gender = $request->input('gender');
            $newuser->status = $request->input('status');
            $newuser->save();
        } catch(QueryException $e) {
            // Log::error($e->getMessage());
            return response()->json(['Error', 'No data passed'], 500);
        }
        catch(Exception $e) {
            // Log::error($e->getMessage());
            return response()->json(['Error', 'Unknown error'], 500);
        }
        return response()->json($newuser);
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
            $user = User::findOrFail($id);
            return response()->json($user);
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
            $newuser = User::where('email', $request->input('email'))
            ->firstOrFail();
            $user_data = $request->except(['email']);
            $newuser['name'] = isset($user_data['name']) ? $user_data['name'] : $newuser['name'];
            $newuser['gender'] = isset($user_data['gender']) ? $user_data['gender'] : $newuser['gender'];
            $newuser['status'] = isset($user_data['status']) ? $user_data['status'] : $newuser['status'];
            $newuser->save();
        }
        catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'User not found'], 404);
        }
        catch (Exception $e) {
            return response()->json(['error' => 'Unknown error occured'], 500);
        }
        return response()->json($newuser);
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
            $newuserProject = UserProjects::where("user_id", $id)->exists();
            if($newuserProject) {
                return response()->json(["error" => "Cannot delete due to foreign key constraint"]);
            }
            $newuser = User::findOrFail($id);
            $newuser->delete();
            return response()->json("User deleted successfully");
        } catch(ModelNotFoundException $e) {
            return response()->json(["error" => "User not Found"], 404);
        }
        catch(Exception $e) {
            return response()->json(["error" => "Failed to delete User"], 500);
        }
    }
}
