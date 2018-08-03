<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('fullname');
            $table->string('affiliation')->nullable();

            $table->string('email')->unique();
            $table->string('password');
            $table->string('contact_no')->unique();

            $table->text('saved_location')->nullable();
            $table->text('home_location')->nullable();
            
            $table->text('saved_location_details')->nullable();
            $table->text('home_location_details')->nullable();

            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
