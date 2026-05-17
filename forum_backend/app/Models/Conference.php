<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conference extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre', 'description', 'date',
        'heure_debut', 'heure_fin', 'salle',
        'speaker', 'speaker_id', 'max_participants',
    ];

    protected $casts = ['date' => 'date:Y-m-d'];

    public function inscrits()
    {
        return $this->belongsToMany(User::class, 'inscriptions')->withTimestamps();
    }

    public function speakerUser()
    {
        return $this->belongsTo(User::class, 'speaker_id');
    }

    public function toArray(): array
    {
        return [
            'id'              => $this->id,
            'titre'           => $this->titre,
            'description'     => $this->description,
            'date'            => $this->date?->format('Y-m-d'),
            'heureDebut' => substr($this->heure_debut, 0, 5),
            'heureFin'   => substr($this->heure_fin, 0, 5),
            'salle'           => $this->salle,
            'speaker'         => $this->speaker,
            'speakerId'       => $this->speaker_id,
            'maxParticipants' => $this->max_participants,
        ];
    }
}
