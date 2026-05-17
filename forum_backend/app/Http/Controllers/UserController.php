<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use App\Models\Stand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function monEspace(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = [
            'user' => [
                'id'    => $user->id,
                'nom'   => $user->nom,
                'email' => $user->email,
                'role'  => $user->role,
                'bio'   => $user->bio,
            ],
        ];

        switch ($user->role) {
            case 'etudiant':
                $conferences = $user->inscriptions()
                    ->orderBy('date')->orderBy('heure_debut')->get();
                $data['inscriptions'] = $conferences->pluck('id')->toArray();
                $data['conferences']  = $conferences;
                break;

            case 'entreprise':
                $data['stand'] = Stand::where('entreprise_id', $user->id)->first();
                break;

            case 'conferencier':
                $data['conference'] = Conference::where('speaker_id', $user->id)->first();
                break;
        }

        return response()->json($data);
    }

    public function updateBio(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->isConferencier()) {
            return response()->json(['message' => 'Action réservée aux conférenciers.'], 403);
        }

        $data = $request->validate([
            'bio' => ['required', 'string', 'max:1000'],
        ]);

        $user->update(['bio' => $data['bio']]);

        return response()->json(['message' => 'Biographie enregistrée.', 'bio' => $user->bio]);
    }
}
