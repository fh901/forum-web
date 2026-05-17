<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stand extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description', 'disponible', 'entreprise', 'entreprise_id'];

    protected $casts = ['disponible' => 'boolean'];

    public function entrepriseUser()
    {
        return $this->belongsTo(User::class, 'entreprise_id');
    }

    public function toArray(): array
    {
        return [
            'id'           => $this->id,
            'nom'          => $this->nom,
            'description'  => $this->description,
            'disponible'   => (bool) $this->disponible,
            'entreprise'   => $this->entreprise,
            'entrepriseId' => $this->entreprise_id,
        ];
    }
}
