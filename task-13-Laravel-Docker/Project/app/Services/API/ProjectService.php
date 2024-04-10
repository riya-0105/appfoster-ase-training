<?php 
namespace App\Services\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserProjects;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class ProjectService {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $project = UserProjects::all();
        return response()->json($project);;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $newProject = new UserProjects;
            $newProject->user_id = $request->input('user_id');
            $user = User::findOrFail($newProject->user_id);
            $newProject->{'Project Title'} = $request->input('Project Title');
            $newProject->{'Technology Used'} = json_encode($request->input('Technology Used'));
            $newProject->{'Project Description'} = $request->input('Project Description');
            $newProject->save();
        } catch(QueryException $e) {
            return response()->json(['Error', 'No data passed'], 500);
        }
        catch(Exception $e) {
            return response()->json(['Error', 'Unknown error'], $e);
        }
        return response()->json($newProject);
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
            $project = UserProjects::findOrFail($id);
            return response()->json($project);
        }
        catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Project not Found'], 404);
        }
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
        try{
            $newProject = UserProjects::findOrFail($id);
            // return response()->json($newProject);
            $project = $request->except(['Project Title', 'user_id']);
            // return response()->json($project);
            $project['Technology Used'] = isset($project['Technology Used']) ? json_encode($project['Technology Used']) : $newProject['Technology Used'];
            $project['Project Description'] = empty($project['Project Description']) ? $newProject['Project Description'] : $project['Project Description'];
            // dd($project);
            $newProject->fill($project)->save();
        } 
        catch(ModelNotFoundException $e) {
            return response()->json(['error' =>'User not found'], 404);
        }
        catch(QueryException $e) {
            return response()->json(['Error', 'No data passed'], 500);
        }
        catch (Exception $e) {
            return response()->json(['error' => 'Failed to update project'], 500);
        }
        return response()->json($newProject);
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
            $newProject = UserProjects::findOrFail($id);
            $newProject->delete();
            return response()->json("User deleted successfully");
       } catch(ModelNotFoundException $e) {
            return response()->json(['error' => 'Project not found'], 404);
       }
       catch(Exception $e) {
            return response()->json(['error' => 'Project not found'], 404);
       }
    }
}