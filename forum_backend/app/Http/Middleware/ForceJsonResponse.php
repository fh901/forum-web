<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceJsonResponse
{
    /**
     * Force l'en-tête Accept: application/json sur toutes les requêtes API.
     * Cela évite que Laravel tente de rediriger vers une route "login"
     * inexistante quand l'authentification échoue.
     */
    public function handle(Request $request, Closure $next)
    {
        $request->headers->set('Accept', 'application/json');
        return $next($request);
    }
}
