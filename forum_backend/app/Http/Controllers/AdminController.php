<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use App\Models\Stand;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'users'        => User::count(),
            'conferences'  => Conference::count(),
            'stands'       => Stand::count(),
            'reservations' => Stand::where('disponible', false)->count(),
        ]);
    }

    public function users(): JsonResponse
    {
        $users = User::orderBy('id')->get()->map(fn(User $u) => [
            'id'    => $u->id,
            'nom'   => $u->nom,
            'email' => $u->email,
            'role'  => $u->role,
        ]);

        return response()->json($users);
    }

    public function updateUser(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'nom'      => ['sometimes', 'string', 'max:255'],
            'email'    => ['sometimes', 'email', 'unique:users,email,' . $user->id],
            'role'     => ['sometimes', 'in:admin,etudiant,entreprise,conferencier'],
            'password' => ['sometimes', 'nullable', 'string', PasswordRule::min(6)],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json([
            'id'    => $user->id,
            'nom'   => $user->nom,
            'email' => $user->email,
            'role'  => $user->role,
        ]);
    }

    public function deleteUser(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 403);
        }

        Stand::where('entreprise_id', $user->id)->update([
            'disponible'    => true,
            'entreprise'    => null,
            'entreprise_id' => null,
        ]);

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }
}
