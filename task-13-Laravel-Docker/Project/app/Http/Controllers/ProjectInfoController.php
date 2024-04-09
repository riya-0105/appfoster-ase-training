<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Api\v2\ProjectController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserProjects;
use App\Models\User;
use Illuminate\View\View;

class ProjectInfoController extends Controller
{
    // to list down all the projects
    public function list(Request $request): View {
        $pageSize = $request->input('pageSize', 10);
        $projects = UserProjects::paginate($pageSize);
        $project_user = [];
        foreach($projects as $project) {
            $user = User::find($project->user_id);
            $combinedData = [
                'project' => $project,
                'user' => $user,
            ];
            $project_user[] = $combinedData;
        }
        // pass pagination->links and combined project and user info
        return view('projects', compact('project_user', 'projects'));
    }

    // list down all users for providing option field for selecting user
    // project table referencing to user id of user table, 
    // so user list created to maintain foreign key constraint

    public function user_list() {
        $user = User::all();
        return view("layouts.projects.project_form", compact('user'));
    }

    // create project and storing it in db
    public function create(Request $request) {
        $project = new ProjectController();
        $data = $project->store($request);
        return view("layouts.projects.project_form", compact('data'));
    }

    // for pagination testing purposes  
    public function Anotherlist(Request $request) {
        $n = $request->input('n', 10);
        $projects = UserProjects::paginate($n);
        $project_user = [];
        foreach($projects as $project) {
            $user = User::find($project->user_id);
            $combinedData = [
                'project' => $project,
                'user' => $user,
            ];
            $project_user[] = $combinedData;
        }
        return view('welcome', compact('project_user', 'projects'));
    }
    public function User_project_list(Request $request) {
        $pageSize = $request->input('pageSize', 10);
        $projects = UserProjects::paginate($pageSize);
        $project_user = [];
        foreach($projects as $project) {
            $user = User::find($project->user_id);
            $combinedData = [
                'project' => $project,
                'user' => $user,
            ];
            $project_user[] = $combinedData;
        }
        return view('welcome', compact('project_user', 'projects'));
    }

}
