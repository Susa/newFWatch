<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Watcher extends Model
{
  public function user()
  {
    return $this->belongsTo('App\User');
  }

  public function event()
  {
    return $this->belongsTo('App\Models\User');
  }
}
