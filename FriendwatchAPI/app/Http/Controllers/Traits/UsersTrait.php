<?php

namespace App\Http\Controllers\Traits;

use App\User;
use App\Models\Watcher;
use App\Models\Event;
use Auth;
use Illuminate\Support\Facades\Log;

trait UsersTrait
{

  public function func_saveUser($request)
  {
      $obj = new User;

      if(!empty($request->user_id)){
        $obj = User::find($request->user_id);
      }
      else {
        $obj->password = bcrypt($request->password);
      }

      $obj->fullname = $request->fullname;
      $obj->email = $request->email;
      $obj->contact_no = $request->contact_no;

      if(!empty($request->user_id)){
        
        // if($request->home_changed){
        //   $obj->home_location = $request->home_location;
        //   $obj->home_location_details = stripslashes(json_encode($request->home_location_details));
        // }
        
        if($request->saved_changed){
          $obj->saved_location = $request->saved_location;
          $obj->saved_location_details = stripslashes(json_encode($request->saved_location_details));
        }

      }
      else if(empty($request->user_id)){
        $obj->saved_location = $request->saved_location;
        //$obj->home_location = $request->home_location;
  
        $obj->saved_location_details = json_encode($request->saved_location_details);
        //$obj->home_location_details = json_encode($request->home_location_details);
      }


      $obj->save();

      if(!empty($request->user_id)){
        return $obj;
      }
      
      return $obj->id;
  }

  // public function func_getUserUnique($email)
  // {
  //   User::where('email', $email)
  // }

  public function func_getUsers()
  {
      $objectList = User::orderBy('created_at')->get();
      return $objectList;
  }

  public function func_getUser($id)
  {
      $obj = User::find($id);

      $usersCount = User::count() - 1;

      $watchCount = Watcher::where('user_id', $id)->count();

      $eventCount = Event::where('user_id', $id)->count();

      $resultArray = [
        'user' => $obj,
        'user_count' => $usersCount,
        'watch_count' => $watchCount,
        'event_count' => $eventCount
      ];
      
      return $resultArray;
  }

  public function func_getUsersExceptMe()
  {
    $objectList = User::whereRaw('id != ?', [Auth::user()->id])->orderBy('created_at')->get();
    return $objectList;
  }

  public function func_deleteUser($objID)
  {
      User::destroy($objID);
      return;
  }
}
