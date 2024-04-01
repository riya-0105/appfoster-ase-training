<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Api\v1\PostController;

use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    function list() {
        $postController = new PostController();
        $data = $postController->index()->getData();
        return view('welcome', compact('data'));
    }
}
