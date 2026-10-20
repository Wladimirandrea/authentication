<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Registro de usuario con imagen y rol.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'image'    => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048', // máx 2MB
            'role'     => 'nullable|string|in:admin,editor,user',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            // Guarda la imagen en storage/app/public/users
            $imagePath = $request->file('image')->store('users', 'public');
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'image'    => $imagePath ? Storage::url($imagePath) : null,
            'role'     => $request->role ?? 'user',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Usuario registrado con éxito',
            'user'         => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ], 201);
    }

    /**
     * Inicio de sesión.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Inicio de sesión exitoso',
            'user'         => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    /**
     * Cerrar sesión (revocar token).
     */
    public function logout(Request $request)
    {
        // Revoca el token con el que el usuario se autenticó
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente',
        ]);
    }

    /**
     * Obtener el perfil del usuario autenticado.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}