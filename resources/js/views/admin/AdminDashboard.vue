<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Cabecera del Panel -->
    <div class="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p class="text-gray-600 mt-1">Monitoreando registros de clientes en tiempo real...</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Nombre del administrador logueado -->
        <div v-if="adminName" class="flex items-center gap-2 text-gray-700 text-sm font-medium">
          <i class="fa-solid fa-user-shield text-indigo-600"></i>
          <span>{{ adminName }}</span>
        </div>

        <!-- Botón de sonido: solo icono (campana = activado, campana tachada = desactivado).
             Si el navegador bloquea el audio, la campana parpadea en ámbar hasta el próximo clic -->
        <button
          @click="toggleSound"
          :title="soundBlocked
            ? 'Haz clic en la página para habilitar el sonido'
            : (soundOn ? 'Sonido activado (clic para silenciar)' : 'Sonido desactivado (clic para activar)')"
          :aria-label="soundOn ? 'Silenciar notificaciones' : 'Activar sonido de notificaciones'"
          :class="soundOn
            ? 'bg-green-100 hover:bg-green-200 text-green-800'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'"
          class="w-10 h-10 flex items-center justify-center rounded-md transition"
        >
          <i
            :class="[
              soundOn ? 'fa-solid fa-bell' : 'fa-solid fa-bell-slash',
              soundBlocked ? 'animate-pulse text-amber-600' : ''
            ]"
          ></i>
        </button>

        <button 
          @click="handleLogout" 
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Tarjeta de Estado del WebSocket -->
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Estado del Sistema</p>
            <p class="text-lg font-semibold text-green-600 flex items-center mt-1">
              <span class="w-3 h-3 bg-green-500 rounded-full inline-block mr-2 animate-pulse"></span>
              Conectado (WebSockets)
            </p>
          </div>
        </div>
      </div>

      <!-- Tarjeta de Clientes Recientes en vivo -->
      <div class="bg-white p-6 rounded-lg shadow-md md:col-span-2">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Clientes Registrados Recientemente</h2>
        
        <div v-if="recentClients.length === 0" class="text-gray-500 text-sm py-4">
          Esperando nuevos registros... Las notificaciones aparecerán aquí y en un Toast flotante automáticamente.
        </div>

        <ul v-else class="divide-y divide-gray-200">
          <li v-for="client in recentClients" :key="client.id" class="py-3 flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-800">{{ client.name }}</p>
              <p class="text-sm text-gray-500">{{ client.email }}</p>
            </div>
            <span class="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full font-medium">
              Nuevo Cliente
            </span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export default {
  name: 'AdminDashboard',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const recentClients = ref([]);

    // Nombre del administrador logueado (viene del store de autenticación)
    const adminName = computed(() => authStore.user?.name ?? '');

    // Se declara fuera de onMounted para poder cerrarla en onUnmounted
    let echo = null;

    // ---------- Sonido ----------
    // Archivo en: public/sounds/notification.mp3
    const notificationSound = new Audio('/sounds/notification.mp3');

    // Siempre activado al cargar la página
    const soundOn = ref(true);
    // true cuando el navegador bloqueó el audio (falta una interacción del usuario)
    const soundBlocked = ref(false);

    // Eventos del usuario que desbloquean el audio en el navegador (en silencio)
    const unlockEvents = ['pointerdown', 'keydown', 'touchstart'];

    const removeUnlockListeners = () => {
      unlockEvents.forEach((ev) => window.removeEventListener(ev, tryUnlockAudio));
    };

    const tryUnlockAudio = () => {
      notificationSound.play().then(() => {
        notificationSound.pause();
        notificationSound.currentTime = 0;
        soundBlocked.value = false;
        removeUnlockListeners();
      }).catch(() => {});
    };

    const addUnlockListeners = () => {
      unlockEvents.forEach((ev) => window.addEventListener(ev, tryUnlockAudio));
    };

    const toggleSound = () => {
      soundOn.value = !soundOn.value;
      if (soundOn.value) tryUnlockAudio();
    };

    const playSound = () => {
      if (!soundOn.value) return;
      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {
        // El navegador aún no permite audio: se desbloqueará con el próximo clic
        soundBlocked.value = true;
        addUnlockListeners();
      });
    };

    // ---------- Logout ----------
    const handleLogout = async () => {
      await authStore.logout();
      router.replace('/login');
    };

    // ---------- Evento recibido ----------
    const handleClientRegistered = (e) => {
      // Evita procesar dos veces el mismo cliente (sonido, toast y fila)
      if (recentClients.value.some((c) => c.id === e.client.id)) return;

      playSound();

      toast.success(`¡Nuevo cliente registrado: ${e.client.name}!`, {
        toastId: `client-${e.client.id}`, // un toast por cliente
        autoClose: 5000,
        position: 'bottom-right',
      });

      recentClients.value.unshift(e.client);
    };

    onMounted(() => {
      addUnlockListeners();

      // Si quedó una instancia anterior viva (por hot reload), ciérrala primero
      if (window.__adminEcho) {
        window.__adminEcho.leave('admin-notifications');
        window.__adminEcho.disconnect();
        window.__adminEcho = null;
      }

      // Inicializar Laravel Echo con autenticación de Token Bearer para canales privados
      echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST ?? '127.0.0.1',
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: 'http://127.0.0.1:8001/broadcasting/auth', // Debe coincidir con el host/puerto de tu backend
        auth: {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            Accept: 'application/json',
          },
        },
      });

      window.__adminEcho = echo;

      // Escuchar el canal privado 'admin-notifications'
      echo.private('admin-notifications')
        .listen('ClientRegistered', handleClientRegistered);
    });

    onUnmounted(() => {
      removeUnlockListeners();

      if (echo) {
        echo.leave('admin-notifications');
        echo.disconnect();
        echo = null;
        window.__adminEcho = null;
      }
    });

    return {
      handleLogout,
      recentClients,
      adminName,
      soundOn,
      soundBlocked,
      toggleSound,
    };
  },
};
</script>