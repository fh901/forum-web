<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConferenceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isConferencier()) {
            $conferences = Conference::where('speaker_id', $user->id)
                ->orderBy('date')->orderBy('heure_debut')->get();
        } else {
            $conferences = Conference::orderBy('date')->orderBy('heure_debut')->get();
        }

        $inscriptions = $user->isEtudiant()
            ? $user->inscriptions()->pluck('conference_id')->toArray()
            : [];

        return response()->json([
            'conferences'  => $conferences,
            'inscriptions' => $inscriptions,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'titre'           => ['required', 'string', 'max:255'],
            'description'     => ['required', 'string'],
            'date'            => ['required', 'date'],
            'heureDebut'      => ['required', 'date_format:H:i'],
            'heureFin'        => ['required', 'date_format:H:i'],
            'salle'           => ['required', 'string', 'max:100'],
            'speaker'         => ['required', 'string', 'max:255'],
            'speakerId'       => ['nullable', 'exists:users,id'],
            'maxParticipants' => ['nullable', 'integer', 'min:1'],
        ]);

        $conference = Conference::create([
            'titre'            => $data['titre'],
            'description'      => $data['description'],
            'date'             => $data['date'],
            'heure_debut'      => $data['heureDebut'],
            'heure_fin'        => $data['heureFin'],
            'salle'            => $data['salle'],
            'speaker'          => $data['speaker'],
            'speaker_id'       => $data['speakerId'] ?? null,
            'max_participants'  => $data['maxParticipants'] ?? 60,
        ]);

        return response()->json($conference, 201);
    }

    public function update(Request $request, Conference $conference): JsonResponse
    {
        $data = $request->validate([
            'titre'           => ['sometimes', 'string', 'max:255'],
            'description'     => ['sometimes', 'string'],
            'date'            => ['sometimes', 'date'],
            'heureDebut'      => ['sometimes', 'date_format:H:i'],
            'heureFin'        => ['sometimes', 'date_format:H:i'],
            'salle'           => ['sometimes', 'string', 'max:100'],
            'speaker'         => ['sometimes', 'string', 'max:255'],
            'speakerId'       => ['nullable', 'exists:users,id'],
            'maxParticipants' => ['nullable', 'integer', 'min:1'],
        ]);

        $conference->update([
            'titre'            => $data['titre']           ?? $conference->titre,
            'description'      => $data['description']     ?? $conference->description,
            'date'             => $data['date']             ?? $conference->date,
            'heure_debut'      => $data['heureDebut']       ?? $conference->heure_debut,
            'heure_fin'        => $data['heureFin']         ?? $conference->heure_fin,
            'salle'            => $data['salle']            ?? $conference->salle,
            'speaker'          => $data['speaker']          ?? $conference->speaker,
            'speaker_id'       => array_key_exists('speakerId', $data) ? $data['speakerId'] : $conference->speaker_id,
            'max_participants'  => $data['maxParticipants'] ?? $conference->max_participants,
        ]);

        return response()->json($conference->fresh());
    }

    public function destroy(Conference $conference): JsonResponse
    {
        $conference->delete();
        return response()->json(['message' => 'Conférence supprimée.']);
    }

    public function inscrire(Request $request, Conference $conference): JsonResponse
    {
        $user = $request->user();

        if (! $user->isEtudiant()) {
            return response()->json(['message' => 'Seuls les étudiants peuvent s\'inscrire.'], 403);
        }

        if ($user->inscriptions()->where('conference_id', $conference->id)->exists()) {
            return response()->json(['message' => 'Vous êtes déjà inscrit à cette conférence.'], 409);
        }

        if ($conference->inscrits()->count() >= $conference->max_participants) {
            return response()->json(['message' => 'Cette conférence est complète.'], 409);
        }

        $user->inscriptions()->attach($conference->id);

        return response()->json([
            'message'      => 'Inscription réussie.',
            'conferenceId' => $conference->id,
        ]);
    }

    public function desinscrire(Request $request, Conference $conference): JsonResponse
    {
        $user = $request->user();

        if (! $user->isEtudiant()) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $user->inscriptions()->detach($conference->id);

        return response()->json([
            'message'      => 'Désinscription réussie.',
            'conferenceId' => $conference->id,
        ]);
    }
}
