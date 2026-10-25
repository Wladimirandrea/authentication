<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Cabecera del Panel -->
    <div class="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Panel de Cliente</h1>
        <p class="text-gray-600 mt-1">Tus compras y perfil.</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Nombre del usuario logueado -->
        <div v-if="userName" class="flex items-center gap-2 text-gray-700 text-sm font-medium">
          <i class="fa-solid fa-user text-green-600"></i>
          <span>{{ userName }}</span>
        </div>

        <button
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Tarjeta de perfil -->
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Mi perfil</h2>

        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <p class="font-medium text-gray-800 truncate">{{ userName }}</p>
            <p class="text-sm text-gray-500 truncate">{{ userEmail }}</p>
          </div>
        </div>

        <span class="inline-block mt-4 text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">
          Cliente
        </span>
      </div>

      <!-- Tarjeta de compras -->
      <div class="bg-white p-6 rounded-lg shadow-md md:col-span-2">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Mis compras</h2>

        <div v-if="orders.length === 0" class="text-gray-500 text-sm py-4">
          Todavía no has realizado ninguna compra. Cuando conectes tu API de pedidos, aparecerán aquí.
        </div>

        <ul v-else class="divide-y divide-gray-200">
          <li v-for="order in orders" :key="order.id" class="py-3 flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-800">Pedido #{{ order.id }}</p>
              <p class="text-sm text-gray-500">{{ order.date }}</p>
            </div>
            <span class="text-sm font-semibold text-gray-800">{{ order.total }}</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'ClientDashboard',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const userName = computed(() => authStore.user?.name ?? '');
    const userEmail = computed(() => authStore.user?.email ?? '');

    // Iniciales para el avatar (ej. "Juan Pérez" -> "JP")
    const initials = computed(() =>
      userName.value
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')
    );

    // Datos de ejemplo: reemplázalos por la respuesta de tu API
    const orders = ref([]);

    const handleLogout = async () => {
      await authStore.logout();
      router.replace('/login');
    };

    return {
      userName,
      userEmail,
      initials,
      orders,
      handleLogout,
    };
  },
};
</script>