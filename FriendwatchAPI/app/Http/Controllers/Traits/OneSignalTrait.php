<?php

namespace App\Http\Controllers\Traits;

use Auth;
use App\User;
use App\Models\Event;
use App\Models\Watcher;
use App\Http\Controllers\Traits\WatcherTrait;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use OneSignal;

trait OneSignalTrait
{
    
  public function sendNotificationByEmails($emails, $message, $heading = ''){

        $emailArr = [];

        $content = array(
            "en" => $message
        );
        
        $headings = array(
            "en" => $heading
        );
        
        foreach($emails as $email){
            array_push(
				$emailArr, 
				array("key" => "email", "relation" => "=", "value" => $email), 
				array("operator" => 'OR'));
        }

		array_pop($emailArr); //removes the last 'operator: OR'

		$fields = array(
			'app_id' => "e2b737c6-705f-4c4f-b651-ae728ca93eb9",
			'tags' => $emailArr,
			'data' => array("foo" => "bar"),
            'contents' => $content,
            'headings' => $headings
		);
		
		$fields = json_encode($fields);
    	print("\nJSON sent:\n");
    	print($fields);
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
												   'Authorization: Basic MzNhZTdhOGItNDYzZi00MDBmLWE2MjctM2MwMGQyNGU4MTRk'));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_POST, TRUE);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

		$response = curl_exec($ch);
		curl_close($ch);
		
        return $response;
    
  }

}
