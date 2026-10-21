<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h2>
    
    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input 
          type="email" 
          v-model="form.email" 
          required 
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="tucorreo@example.com"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input 
          type="password" 
          v-model="form.password" 
          required 
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="********"
        >
      </div>

      <button 
        type="submit" 
        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition duration-150"
      >
        Entrar
      </button>
    </form>

    <div class="mt-4 text-center">
      <router-link to="/" class="text-sm text-indigo-600 hover:underline">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const form = ref({
      email: '',
      password: ''
    });

    const errorMessage = ref('');

    const handleLogin = async () => {
      errorMessage.value = '';
      try {
        await authStore.login(form.value);
        
        const role = authStore.user.role;
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else if (role === 'seller') {
          router.push('/seller/dashboard');
        } else {
          router.push('/client/dashboard');
        }
      } catch (error) {
        errorMessage.value = typeof error === 'string' ? error : 'Credenciales incorrectas o error en el servidor.';
      }
    };

    return { form, errorMessage, handleLogin };
  }
}
</script>