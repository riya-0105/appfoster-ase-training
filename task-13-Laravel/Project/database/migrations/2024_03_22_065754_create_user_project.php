<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_projects', function (Blueprint $table) {
            $table->bigIncrements('project_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
            $table->string('Project Title');
            $table->json('Technology Used')->nullable();
            $table->date('Created On');
            $table->text('Project Description');
            $table->foreign('user_id')->references('id')->on('users');
            $table->primary('project_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_projects');
    }
};
