<?php

namespace App\Http\Controllers\Api\v2;

use App\Models\UserProjects;
use App\Models\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($userId)
    {
        $user = User::findOrFail($userId);
        $project = $user->userProjects()->get();
        return response()->json($project);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $userId)
    {
        $newUserProject = new UserProjects;
        $newUserProject->user_id = $userId;
        $newUserProject->{'Project Title'} = $request->input('Project Title'); 
        $newUserProject->{'Technology Used'} = json_encode($request->input('Technology Used')); 
        $newUserProject->{'Created On'} = $request->input('Created On'); 
        $newUserProject->{'Project Description'} = $request->input('Project Description');
        $newUserProject->save();
        return response()->json($newUserProject);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $newUserProject = UserProjects::where("user_id", $id)->firstOrFail();
        $project = $request->except(['project_id', 'user_id', 'Project Title']);
        foreach($project as $key=>$value) {
            if($key === "Technology Used") {
                $newUserProject->$key = json_encode($value);
            }
            else {
                $newUserProject->$key = $value;
            }
        }
        $newUserProject->save();
        return response()->json($newUserProject);
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
            $newUserProject = UserProjects::findOrFail($id);
            $newUserProject->delete();
            return response()->json("User deleted successfully");
        }
        catch(ModelNotFoundException $e) {
            return response()->json(['error' => 'Project not Found'], 404);
        }
        catch(Exception $e) {
            return response()->json(['error' => 'Cannot delete Project data'], 500);
        }
    }
}
