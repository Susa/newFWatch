<?php

use Illuminate\Http\Request;

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

  Route::middleware('api')->group(function(){
    Route::post('/trylogin', 'HomeController@tryLogin');
    Route::post('/trylogout', 'HomeController@tryLogout');
    Route::post('/user', 'UsersController@saveUser');
  });

  Route::prefix('/v1')->middleware(['auth:api'])->group(function () {

    //Users API
    Route::get('/users', 'UsersController@getUsers');
    Route::get('/user/{id}', 'UsersController@getUser');
    Route::delete('/user/{id}', 'UsersController@deleteUser');

    Route::get('/users/exceptme', 'UsersController@getUsersExceptMe');
    Route::get('/users/checkunique', 'UsersController@getUserUnique');

    //Events API
    Route::get('/events', 'EventController@getEvents');
    Route::get('/events/{user}', 'EventController@getEventsByUser');
    Route::get('/events/{user}/summary', 'EventController@getEventsByUserSummary');
    Route::get('/events/{user}/today', 'EventController@getEventsByUserToday');
    Route::get('/events/{user}/nottoday', 'EventController@getEventsByUserNotToday');
    Route::post('/events/notifywatchers', 'EventController@notifyWatchers');

    Route::post('/event', 'EventController@saveEvent');
    Route::post('/updatereturn', 'EventController@updateReturnPlans');
    
    Route::get('/sendnotif', 'EventController@sendNotification');

    Route::post('/acceptinvitation', 'WatcherController@acceptInvitation');
    Route::delete('/event/{id}', 'EventController@deleteEvent');

    //Watcher API
    Route::get('/watchers', 'WatcherController@getWatchers');
    Route::post('/watcher', 'WatcherController@saveWatcher');
    Route::delete('/watcher/{id}', 'WatcherController@deleteWatcher');
  });
