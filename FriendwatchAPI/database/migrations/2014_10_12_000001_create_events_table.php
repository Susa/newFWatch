<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id');

            $table->string('title');
            $table->string('description')->nullable();

            $table->string('return_plan')->nullable();
            $table->string('return_transpo')->nullable();
            
            $table->string('location')->nullable();

            $table->string('longitude')->nullable();
            $table->string('latitude')->nullable();

            $table->text('event_location')->nullable();
            $table->text('event_location_details')->nullable();
            
            $table->string('time_of_leave')->nullable();
            $table->string('calculated_arrival_time')->nullable();

            $table->date('event_date')->nullable();
            $table->time('event_time')->nullable();

            $table->integer('user_id')->unsigned()->nullable();
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
