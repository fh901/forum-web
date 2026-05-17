<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre', 'contenu', 'fichier_nom',
        'fichier_path', 'fichier_type', 'publie',
    ];

    protected $casts = ['publie' => 'boolean'];

    public function toArray(): array
    {
        return [
            'id'      => $this->id,
            'titre'   => $this->titre,
            'contenu' => $this->contenu,
            'publie'  => (bool) $this->publie,
            'dateMAJ' => $this->updated_at?->format('d/m/Y'),
            'fichier' => $this->fichier_path ? [
                'nom'  => $this->fichier_nom,
                'type' => $this->fichier_type,
                'url'  => url('storage/' . $this->fichier_path),
            ] : null,
        ];
    }
}
