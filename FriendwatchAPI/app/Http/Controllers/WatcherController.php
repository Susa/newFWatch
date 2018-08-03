<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Traits\WatcherTrait;

class WatcherController extends Controller
{
  use WatcherTrait;

  public function saveWatcher(Request $request)
  {
    $this->func_saveWatcher($request);
    return response()->json(200);
  }

  public function acceptInvitation(Request $request)
  {
    $this->func_acceptInvitation($request);
    return response()->json(200);
  }

  public function getWatchers()
  {
    $objList = $this->func_getWatchers();
    return response()->json($objList);
  }

  public function deleteWatcher($id)
  {
    if(empty($id)){
      return response()->json([
        'status' => 400,
        'message' => 'id is required'
      ]);
    }
    else {
      $this->func_deleteWatcher($id);
      return response()->json([
        'status' => 200,
        'message' => 'success'
      ]);
    }
  }
}
