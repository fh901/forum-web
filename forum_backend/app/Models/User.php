<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['nom', 'email', 'password', 'role', 'bio'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = ['password' => 'hashed'];

    public function inscriptions()
    {
        return $this->belongsToMany(Conference::class, 'inscriptions')->withTimestamps();
    }

    public function conferences()
    {
        return $this->hasMany(Conference::class, 'speaker_id');
    }

    public function stand()
    {
        return $this->hasOne(Stand::class, 'entreprise_id');
    }

    public function isAdmin(): bool        { return $this->role === 'admin'; }
    public function isEtudiant(): bool     { return $this->role === 'etudiant'; }
    public function isEntreprise(): bool   { return $this->role === 'entreprise'; }
    public function isConferencier(): bool { return $this->role === 'conferencier'; }
}
