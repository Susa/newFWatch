<?php

namespace App\Http\Controllers\Traits;

use Auth;
use App\User;
use App\Models\Event;
use App\Models\Watcher;
use App\Http\Controllers\Traits\WatcherTrait;
use App\Http\Controllers\Traits\OneSignalTrait;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use OneSignal;

trait EventTrait
{
  use WatcherTrait, OneSignalTrait;

  public function func_saveEvent($request)
  {   
      $userAccount = User::find($request->user_id);

      $obj = new Event;

      $obj->user_id = $userAccount->getKey();

      $obj->title = $request->payload['title'];
      $obj->description = $request->payload['description'];

      $obj->event_date = Carbon::parse($request->payload['event_date']);
      $obj->event_time = Carbon::parse($request->payload['event_time']);

      $obj->event_location = $request->event_location;
      $obj->event_location_details = json_encode($request->event_location_details);

      $obj->save();

      $invitedEmails = [];

      foreach($request->invited as $user){
        $this->func_saveWatcher2($user, $obj->id);
        array_push($invitedEmails, $user['email']);
      }

      if(!empty($invitedEmails)){
        $message = "You've been invited by " . $userAccount->fullname . " to watch him/her at " . $obj->title;
        $content = $this->func_sendNotificationToUser($invitedEmails, $message, "Friendwatch Invitation");
        return $obj->id;
      }

      return $obj->id;
  }

  public function func_notifyWatchers($request)
  {
    $event = Event::find($request['event_id']);
    $user = User::find($event->user_id);
    $emails = [];
    $watchersList = $this->func_getWatchersByEvent($request['event_id']);

    foreach($watchersList as $watcher){
      array_push($emails, $watcher->user->email);
    }

    $message = "Hello. This is to inform you that " . $user->fullname . " has arrived at " . $event->event_location . " for the " . $event->title . " event.";
    $heading = "Friendwatch Arrival Notification";

    return $this->sendNotificationByEmails($emails, $message, $heading);
  }

  public function func_sendNotificationToUser($email, $message, $heading)
  {
    return $this->sendNotificationByEmails($email, $message, $heading);
  }

  public function func_updateReturnPlans($request)
  {

      $obj = Event::find($request->event_id);

      $obj->return_plan = $request->return_plan;
      $obj->return_transpo = $request->return_transpo;

      $obj->save();

      return $obj->id;
  }

  public function func_getEvent($eventID)
  {
    $eventContent = Event::find($eventID);
    return $eventContent->data;
  }

  public function func_getEvents()
  {
      $objectList = Event::orderBy('created_at')->get();
      return $objectList;
  }

  public function func_getEventsByUser($userID)
  {
    $objectList = Event::where('user_id', $userID)->with('user')->get();
    return $objectList;
  }

  public function func_getEventsByUserSummary($userID)
  {
    $upcomingList = $this->func_getUpcomingUserEvents($userID);
    $todayList = $this->func_getTodayUserEvents($userID);
    $invitationList = $this->func_getInvitationUserEvents($userID);

    return [
      'upcoming' => $upcomingList,
      'today' => $todayList,
      'invitations' => $invitationList
    ];
  }

  public function func_getUpcomingUserEvents($userID)
  {
    $events = $this->func_getUserAcceptedEvents($userID);

    $eventsList = [];

    foreach($events as $event){
      $eventDate = Carbon::parse($event->event_date . '00:00:00');
      $dateToday = Carbon::now("Asia/Manila");

      $eventDateStr = Carbon::parse($event->event_date . '00:00:00')->toDateString();
      $dateTodayStr = Carbon::now("Asia/Manila")->toDateString();
      
      if($eventDate->greaterThan($dateToday) && $eventDateStr !== $dateTodayStr){
        array_push($eventsList, $event);
      }
    }

    return $eventsList;
  }

  public function func_getTodayUserEvents($userID)
  {
    $acceptedInvitations = $this->func_getUserAcceptedEvents($userID);
    $eventsList = [];

    foreach($acceptedInvitations as $obj){
      $dateToday = Carbon::now("Asia/Manila")->toDateString();
      $eventDate = Carbon::parse($obj->event_date)->toDateString();

      if($dateToday === $eventDate)
        array_push($eventsList, $obj);
    }

    return $eventsList;
  }

  public function func_getInvitationUserEvents($userID)
  {
    $objectList = Watcher::whereRaw('user_id = ? and accepted = false', [$userID])->orderBy('created_at')->get();
    return $this->processQuery($objectList);
  }

  public function func_getUserAcceptedEvents($userID)
  {
    $objectList = Watcher::whereRaw('user_id = ? and accepted = true', [$userID])->orderBy('created_at')->get();
    return $this->processQuery($objectList);
  }

  public function processQuery($watcherList){
    $events = [];

    foreach($watcherList as $obj)
    {
      $eventInfo = Event::where('id', $obj['event_id'])->with('user')->first();
      array_push($events, $eventInfo);
    }
    
    return $events;
  }

  public function func_deleteEvent($objID)
  {
      Event::destroy($objID);
      return;
  }
}
