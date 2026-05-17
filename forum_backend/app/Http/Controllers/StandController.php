<?php

namespace App\Http\Controllers;

use App\Models\Stand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StandController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Stand::orderBy('nom')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom'         => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'disponible'  => ['sometimes', 'boolean'],
        ]);

        $stand = Stand::create([
            'nom'          => $data['nom'],
            'description'  => $data['description'],
            'disponible'   => $data['disponible'] ?? true,
            'entreprise'   => null,
            'entreprise_id' => null,
        ]);

        return response()->json($stand, 201);
    }

    public function update(Request $request, Stand $stand): JsonResponse
    {
        $data = $request->validate([
            'nom'         => ['sometimes', 'string', 'max:100'],
            'description' => ['sometimes', 'string'],
            'disponible'  => ['sometimes', 'boolean'],
        ]);

        $stand->update($data);
        return response()->json($stand->fresh());
    }

    public function destroy(Stand $stand): JsonResponse
    {
        $stand->delete();
        return response()->json(['message' => 'Stand supprimé.']);
    }

    public function reserver(Request $request, Stand $stand): JsonResponse
    {
        $user = $request->user();

        if (! $user->isEntreprise()) {
            return response()->json(['message' => 'Seules les entreprises peuvent réserver un stand.'], 403);
        }

        if (! $stand->disponible) {
            return response()->json(['message' => 'Ce stand n\'est pas disponible.'], 409);
        }

        if (Stand::where('entreprise_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'Vous avez déjà un stand réservé. Libérez-le avant d\'en réserver un autre.',
            ], 409);
        }

        $stand->update([
            'disponible'    => false,
            'entreprise'    => $user->nom,
            'entreprise_id' => $user->id,
        ]);

        return response()->json($stand->fresh());
    }

    public function liberer(Request $request, Stand $stand): JsonResponse
    {
        $user = $request->user();

        $peutLiberer = $user->isAdmin()
            || ($user->isEntreprise() && $stand->entreprise_id === $user->id);

        if (! $peutLiberer) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $stand->update([
            'disponible'    => true,
            'entreprise'    => null,
            'entreprise_id' => null,
        ]);

        return response()->json($stand->fresh());
    }
}
