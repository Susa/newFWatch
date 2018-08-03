<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Traits\EventTrait;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
  use EventTrait;

  public function saveEvent(Request $request)
  {
    $this->func_saveEvent($request);
    return response()->json(200);
  }

  public function updateReturnPlans(Request $request)
  {
    $this->func_updateReturnPlans($request);
    return response()->json(200);
  }

  public function getEvents(Request $request)
  {
    $objList = $this->func_getEvents();
    return response()->json($objList);
  }

  public function getEvent($id)
  {
    $objResult = $this->func_getEvent($id);
    return response()->json($objResult);
  }

  public function getEventsByUser($user)
  {
    $objList = $this->func_getEventsByUser($user);
    return response()->json($objList);
  }

  public function notifyWatchers(Request $request)
  {
    $this->func_notifyWatchers($request);
    return response()->json(200);
  }

  public function getEventsByUserSummary($user)
  {
    $objList = $this->func_getEventsByUserSummary($user);
    return response()->json($objList);
  }

  public function getEventsByUserToday($user)
  {
    $objList = $this->func_getEventsByUserToday($user);
    return response()->json($objList);
  }

  public function getEventsByUserNotToday($user)
  {
    $objList = $this->func_getEventsByUserNotToday($user);
    return response()->json($objList);
  }

  public function getEventsByUserInvitation(Request $request)
  {
    $objList = $this->func_getEventsByUserInvitation($request->user_id);
    return response()->json($objList);
  }

  public function sendNotification(Request $request){
    $emailList = explode(',', $request['email']);
    $this->func_sendNotificationToUser($emailList, $request['message'], $request['heading']);
  }

  public function deleteEvent($id)
  {
    if(empty($id)){
      return response()->json([
        'status' => 400,
        'message' => 'id is required'
      ]);
    }
    else {
      $this->func_deleteEvent($id);
      return response()->json([
        'status' => 200,
        'message' => 'success'
      ]);
    }
  }
}
