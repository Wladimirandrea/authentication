<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Cabecera del Panel -->
    <div class="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Panel de Vendedor</h1>
        <p class="text-gray-600 mt-1">Gestión de productos y ventas.</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Nombre del usuario logueado -->
        <div v-if="userName" class="flex items-center gap-2 text-gray-700 text-sm font-medium">
          <i class="fa-solid fa-store text-blue-600"></i>
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

    <!-- Resumen -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Mis productos</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.products }}</p>
          </div>
          <i class="fa-solid fa-box text-2xl text-blue-500"></i>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Ventas del mes</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.sales }}</p>
          </div>
          <i class="fa-solid fa-sack-dollar text-2xl text-green-500"></i>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Pedidos pendientes</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.pendingOrders }}</p>
          </div>
          <i class="fa-solid fa-clock text-2xl text-amber-500"></i>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Últimas ventas</h2>
      <div class="text-gray-500 text-sm py-4">
        Aún no hay ventas registradas. Cuando conectes tu API de productos y pedidos, aparecerán aquí.
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'SellerDashboard',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const userName = computed(() => authStore.user?.name ?? '');

    // Datos de ejemplo: reemplázalos por la respuesta de tu API
    const stats = ref({
      products: 0,
      sales: 0,
      pendingOrders: 0,
    });

    const handleLogout = async () => {
      await authStore.logout();
      router.replace('/login');
    };

    return {
      userName,
      stats,
      handleLogout,
    };
  },
};
</script>