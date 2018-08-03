<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
  public function user(){
    return $this->belongsTo('App\User');
  }

  public function watchers(){
    return $this->hasMany('App\Models\Watcher');
  }
}
