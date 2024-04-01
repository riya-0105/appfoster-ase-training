<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProjects extends Model
{
    use HasFactory;
    public function user() {
        return $this->belongsTo(User::class);
    }
    protected $primaryKey = 'project_id';
    protected $fillable = [
        "project_id",
        "user_id",
        "created_at",
        "updated_at",
        "Project Title",
        "Technology Used",
        "Created On",
        "Project Description"
    ];
}
