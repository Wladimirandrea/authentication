<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Verificar si el usuario está autenticado
        if (! $request->user()) {
            return response()->json([
                'message' => 'No autenticado.'
            ], 401);
        }

        // 2. Comprobar si el rol del usuario está dentro de los roles permitidos
        if (! in_array($request->user()->role, $roles)) {
            return response()->json([
                'message' => 'No tienes permisos para acceder a este recurso.'
            ], 403); // 403 Forbidden
        }

        return $next($request);
    }
}