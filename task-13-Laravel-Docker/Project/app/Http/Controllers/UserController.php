<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Api\v1\PostController;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // list all the user names
    function list(Request $request) {
        $pageSize = $request->input('page_size', 10);
        // $edit_response = null;
        $users = User::paginate($pageSize);
        return view('welcome', compact( 'users', 'pageSize'));
    }

    // creating new user
    function create(Request $request) {
        try {
            if (empty($request->name) || empty($request->email) || empty($request->gender) || empty($request->status)) {
                throw new \Exception("All fields are required");
            }
            $postController = new PostController();
        // data validation before storing
            $validateData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'gender' => 'required|in:Male,Female,Other',
                'status' => 'required|in:Active,Inactive',
            ]);
            $data = $postController->store($request);
            // dd($data);
            return view('layouts.users.form', compact('data'));
        }
        catch (\Exception $e) {
            $data = response()->json(["error" => "No Data passed"], 404);
            // dd($data);
            return view('layouts.users.form', compact('data'));
        }
        
            // api call to store data
        // try {
        //     $postController = new PostController();
        //     // data validation before storing
        //         $validateData = $request->validate([
        //             'name' => 'required|string|max:255',
        //             'email' => 'required|email|unique:users,email',
        //             'gender' => 'required|in:Male,Female,Other',
        //             'status' => 'required|in:Active,Inactive',
        //         ]);
        //         // api call to store data
        //     $data = $postController->store($request);
        //     return view('layouts.users.form', compact('data'));
        // }
        // catch(ModelNotFoundException $e) {
        //     $data = [["error" => "User not Found"], 404];
        //     return response()->json(["error" => "User not Found"], 404);
        // }
        // catch(Exception $e) {
        //     $data = $postController->store($request);
        // }
        
    }


    // update the data after edit 
    function update(Request $request) {
        $user = new PostController();
        // response from edit data api
        $edit_response = $user->update($request);
        $users = User::paginate(10);
        // dd($edit_response);
        return view('welcome', compact('users', 'edit_response'));
    }

    // function delete(Request $request) {
    //     $user = new PostController();
    //     $edit_response = $user->destroy($request);
    //     $users = User::paginate(10);
    //     return view('welcome', compact('users', 'edit_response'));
    // }

    // function create(Request $request) {
    //     // $data = '';
    //     // try {
            
    //     // }
    //     // catch (ValidationException $e) {
    //     //     // Handling validation errors
    //     //     $data = $e;
    //     //     dd($data);
    //     // }
    //     // catch(Exception $err) {
    //     //     // dd($err->getMessage());
    //     //     $data = "Error, Unknown error occur";
    //     //     dd($data);
    //     // }
    //     try {
    //         $postController = new PostController();
    //             $validateData = $request->validate([
    //                 'name' => 'required|string|max:255',
    //                 'email' => 'required|email|unique:users,email',
    //                 'gender' => 'required|in:Male,Female,Other',
    //                 'status' => 'required|in:Active,Inactive',
    //             ]);
    //         $data = $postController->store($request);
    //     }
    //     catch(Exception $e) {
    //         $data = $postController->store($request);
    //     }
    //     return view('layouts.users.form', compact('data'));
    // }
}
