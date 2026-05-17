<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProgrammeController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(Programme::latest()->first());
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'titre'   => ['required', 'string', 'max:255'],
            'contenu' => ['required', 'string'],
            'publie'  => ['sometimes', 'boolean'],
        ]);

        $programme = Programme::latest()->first() ?? new Programme();
        $programme->fill($data)->save();

        return response()->json($programme->fresh());
    }

    public function uploadFichier(Request $request): JsonResponse
    {
        $request->validate([
            'fichier' => [
                'required', 'file',
                'mimetypes:application/pdf,image/png,image/jpeg,image/jpg,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'max:10240',
            ],
        ]);

        $programme = Programme::latest()->first();

        if (! $programme) {
            return response()->json(['message' => 'Aucun programme trouvé.'], 404);
        }

        if ($programme->fichier_path) {
            Storage::disk('public')->delete($programme->fichier_path);
        }

        $file = $request->file('fichier');
        $path = $file->store('programmes', 'public');

        $programme->update([
            'fichier_nom'  => $file->getClientOriginalName(),
            'fichier_path' => $path,
            'fichier_type' => $file->getMimeType(),
        ]);

        return response()->json($programme->fresh());
    }

    public function deleteFichier(): JsonResponse
    {
        $programme = Programme::latest()->first();

        if (! $programme || ! $programme->fichier_path) {
            return response()->json(['message' => 'Aucun fichier à supprimer.'], 404);
        }

        Storage::disk('public')->delete($programme->fichier_path);

        $programme->update([
            'fichier_nom'  => null,
            'fichier_path' => null,
            'fichier_type' => null,
        ]);

        return response()->json($programme->fresh());
    }
}
