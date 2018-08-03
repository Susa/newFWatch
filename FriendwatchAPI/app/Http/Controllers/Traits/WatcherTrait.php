<?php

namespace App\Http\Controllers\Traits;

use Auth;
use App\User;
use App\Models\Watcher;
use App\Models\Event;
use Illuminate\Support\Facades\Log;

trait WatcherTrait
{
  public function func_saveWatcher($request)
  {
      $obj = new Watcher;

      if(!empty($request->watcher_id)){
        $obj = Watcher::find($request->watcher_id);
      }

      $obj->user_id = User::find($request->user_id)->getKey();
      $obj->event_id = Event::find($request->event_id)->getKey();

      $obj->accepted = $request->accepted;
      $obj->return_plan = $request->return_plan;
      $obj->return_transpo = $request->return_transpo;

      $obj->save();

      return $obj->id;
  }

  public function func_acceptInvitation($request)
  {
      $obj = Watcher::whereRaw('event_id = ? and user_id = ?', [$request->event_id, $request->user_id])->first();

      $obj->accepted = true;
      $obj->save();

      return $obj->id;
  }

  public function func_saveWatcher2($request, $event_id)
  {
      $obj = new Watcher;

      $obj->user_id = User::find($request['id'])->getKey();
      $obj->event_id = Event::find($event_id)->getKey();

      $obj->accepted = false;
      // $obj->return_plan = $request->return_plan;
      // $obj->return_transpo = $request->return_transpo;

      $obj->save();

      return $obj->id;
  }

  public function func_getWatchers()
  {
      $objectList = Watcher::orderBy('created_at')->get();
      return $objectList;
  }

  public function func_getWatchersByEvent($eventID)
  {
      $objectList = Watcher::where('event_id', $eventID)->with('user')->get();
      return $objectList;
  }

  public function func_deleteWatcher($objID)
  {
      Watcher::destroy($objID);
      return;
  }
}
