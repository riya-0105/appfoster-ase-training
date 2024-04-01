<?php

use Illuminate\Support\Facades\Route;
use App\Api;
use App\Http\Controllers\Api\v1\PostController;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectInfoController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [ProjectInfoController::class, 'Anotherlist']);

Route::get('/project', [ProjectInfoController::class, 'list']);

Route::get('/profiles',function() {
    return Http::get('api/host/users');
});

Route::get('/create_user', function() {
    return view("form");
});

Route::get('/create_project', [ProjectInfoController::class, 'user_list']);

// Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

// Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');


Route::get('/csrf', function() {
    return csrf_token();
});


Route::get('/host/users', function($id=null, $name=null) {
    return "hello".$id.$name;
});

