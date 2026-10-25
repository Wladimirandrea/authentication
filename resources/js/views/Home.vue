<template>
  <div class="text-center">
    <h1 class="text-3xl font-bold text-indigo-600 mb-4">
      Bienvenido a nuestra aplicación
    </h1>

    <p class="text-gray-600 mb-6">
      Gestiona tu cuenta y accede a nuestros servicios.
    </p>

    <div class="flex flex-col items-center gap-4">
      <div class="flex justify-center gap-4">
        <router-link
          to="/login"
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700"
        >
          Iniciar sesión
        </router-link>
      </div>

      <router-link to="/register" class="text-sm text-indigo-600 hover:underline">
        ¿No tienes cuenta? Regístrate aquí
      </router-link>

      <!-- Instalar la PWA (Android / Chrome / Edge / escritorio) -->
      <button
        v-if="canInstall"
        @click="install"
        class="mt-2 flex items-center gap-2 bg-white text-indigo-700 border border-indigo-200 px-5 py-2.5 rounded-lg shadow-sm hover:bg-indigo-50 text-sm font-medium transition"
      >
        <i class="fa-solid fa-download"></i>
        Instalar aplicación
      </button>

      <!-- Instrucciones para iPhone / iPad -->
      <p v-else-if="showIosHelp" class="mt-2 max-w-xs text-xs text-gray-500">
        <i class="fa-solid fa-mobile-screen mr-1"></i>
        Para instalar en iPhone: toca el botón <strong>Compartir</strong>
        <i class="fa-solid fa-arrow-up-from-bracket mx-1"></i>
        y elige <strong>Añadir a pantalla de inicio</strong>.
      </p>
    </div>
  </div>
</template>

<script>
import { usePwaInstall } from '../composables/usePwaInstall';

export default {
  name: 'Home',
  setup() {
    const { canInstall, showIosHelp, install } = usePwaInstall();
    return { canInstall, showIosHelp, install };
  },
};
</script>
