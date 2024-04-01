<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Api\v2\ProjectController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserProjects;
use App\Models\User;

class ProjectInfoController extends Controller
{
    public function list() {
        $projects = UserProjects::all();
        $project_user = [];
        foreach($projects as $project) {
            $user = User::find($project->user_id);
            $combinedData = [
                'project' => $project,
                'user' => $user,
            ];
            $project_user[] = $combinedData;
        }
        
        return view('projects', compact('project_user'));
    }

    public function Anotherlist() {
        $projects = UserProjects::all();
        $project_user = [];
        foreach($projects as $project) {
            $user = User::find($project->user_id);
            $combinedData = [
                'project' => $project,
                'user' => $user,
            ];
            $project_user[] = $combinedData;
        }
        return view('welcome', compact('project_user'));
    }
    public function user_list() {
        $user = User::all();
        return view("project_form", compact('user'));
    }
}
