<?php
namespace App\Api;

use App\Http\Controllers\Api\v1\PostController;
use App\Http\Controllers\Api\v2\UserProjectController;
use App\Http\Controllers\Api\v2\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


// for trial of post request
Route::post('/reverse-me', function (Request $request) {
    $reversed = strrev($request->input('reverse_this'));
    return $reversed;
});


//   ##   Route for users data

//-- get data
Route::get('host/users', [PostController::class, 'index']);

//-- post data

Route::post('host/users/create_new', [PostController::class, 'store']);

//-- show data
Route::get('host/users/show_user_info/{id}', [PostController::class, 'show']);

//-- update data

Route::post('/host/modify_userInfo', [PostController::class, 'update']);


//-- delete user data
Route::post('/host/delete_user/{id}', [PostController::class, 'destroy'])->name('delete');




//   ##   Route for all projects data

//-- get data

Route::get('host/get_projects', [ProjectController::class, 'index']);

//-- post data
Route::post('host/create_project', [ProjectController::class, 'store']);

//-- update data
Route::post('host/modify_projects/{id}', [ProjectController::class, 'update']);

//-- delete data
Route::post('/host/delete_project/{id}', [ProjectController::class, 'destroy']);

//-- show data
Route::get('/host/show_project/{id}', [ProjectController::class, 'show']);



//   ##   Route for user projects data

//-- get data

Route::get('host/{userId}/projects', [UserProjectController::class, 'index']);

//-- post data
Route::post('host/{userId}/create_projects', [UserProjectController::class, 'store']);

//-- update data
Route::post('host/modify_user_project/{id}', [UserProjectController::class, 'update']);

//-- delete data
Route::get('/host/delete_user_project/{id}', [UserProjectController::class, 'destroy']);

// Route::get('users', function() {

// });