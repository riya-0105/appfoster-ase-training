<?php

namespace App\Http\Controllers\Api\v1;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserProjects;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;


class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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
    public function store(Request $request)
    {
        $newuser = new User;
        $newuser->name = $request->input('name');
        $newuser->email = $request->input('email');
        $newuser->gender = $request->input('gender');
        $newuser->status = $request->input('status');
        $newuser->email_verified_at = now();
        $newuser->password = bcrypt($request->input('password'));
        $newuser->remember_token = $request->input('remember_token');
        $newuser->save();
        return response()->json($newuser);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
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
    public function update(Request $request)
    {
        try {
            $newuser = User::where('email', $request->input('email'))
            ->firstOrFail();
            $valid = Hash::check($request->input('password'), $newuser->password);
            if($valid) {
                $user_data = $request->except(['email', 'password']);
                foreach($user_data as $key => $value) {
                    $newuser->$key = $value;
                }
                $newuser->save();
                return response()->json($newuser);
            }
        }
        catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $newuserProject = UserProjects::where("user_id", $id)->exists();
            if($newuserProject) {
                return response()->json("Cannot delete due to foreign key constraint");
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
