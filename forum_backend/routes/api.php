<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\StandController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ── Publiques ─────────────────────────────────────────────────────────────────
Route::post('/login',           [AuthController::class, 'login']);
Route::post('/register',        [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password',  [AuthController::class, 'resetPassword']);

// ── Protégées (Bearer Token) ──────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Mon Espace
    Route::get('/mon-espace',     [UserController::class, 'monEspace']);
    Route::put('/mon-espace/bio', [UserController::class, 'updateBio']);

    // Conférences — lecture
    Route::get('/conferences', [ConferenceController::class, 'index']);

    // Inscription / Désinscription
    Route::post  ('/conferences/{conference}/inscrire', [ConferenceController::class, 'inscrire']);
    Route::delete('/conferences/{conference}/inscrire', [ConferenceController::class, 'desinscrire']);

    // Conférences — CRUD admin
    Route::middleware('role:admin')->group(function () {
        Route::post  ('/conferences',              [ConferenceController::class, 'store']);
        Route::put   ('/conferences/{conference}', [ConferenceController::class, 'update']);
        Route::delete('/conferences/{conference}', [ConferenceController::class, 'destroy']);
    });

    // Stands — lecture
    Route::get('/stands', [StandController::class, 'index']);

    // Réserver / Libérer
    Route::post  ('/stands/{stand}/reserver', [StandController::class, 'reserver']);
    Route::delete('/stands/{stand}/reserver', [StandController::class, 'liberer']);

    // Stands — CRUD admin
    Route::middleware('role:admin')->group(function () {
        Route::post  ('/stands',         [StandController::class, 'store']);
        Route::put   ('/stands/{stand}', [StandController::class, 'update']);
        Route::delete('/stands/{stand}', [StandController::class, 'destroy']);
    });

    // Programme — lecture
    Route::get('/programme', [ProgrammeController::class, 'show']);

    // Programme — admin
    Route::middleware('role:admin')->group(function () {
        Route::put   ('/programme',         [ProgrammeController::class, 'update']);
        Route::post  ('/programme/fichier', [ProgrammeController::class, 'uploadFichier']);
        Route::delete('/programme/fichier', [ProgrammeController::class, 'deleteFichier']);
    });

    // Administration
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get   ('/stats',        [AdminController::class, 'stats']);
        Route::get   ('/users',        [AdminController::class, 'users']);
        Route::put   ('/users/{user}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    });
});
