<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h2>
    
    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
        <input 
          type="text" 
          v-model="form.name" 
          required 
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Tu Nombre"
        >
      </div>

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

      <div>
        <label class="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
        <input 
          type="password" 
          v-model="form.password_confirmation" 
          required 
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="********"
        >
      </div>

      <button 
        type="submit" 
        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition duration-150"
      >
        Registrarse
      </button>
    </form>

    <div class="mt-4 text-center">
      <router-link to="/login" class="text-sm text-indigo-600 hover:underline">¿Ya tienes una cuenta? Inicia sesión</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const form = ref({
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    });

    const errorMessage = ref('');

    const handleRegister = async () => {
      errorMessage.value = '';
      try {
        await authStore.register(form.value);
        
        // Redirigir según el rol devuelto tras registrarse
        const role = authStore.user.role;
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else if (role === 'seller') {
          router.push('/seller/dashboard');
        } else {
          router.push('/client/dashboard');
        }
      } catch (error) {
        errorMessage.value = typeof error === 'string' ? error : 'Error al registrarse. Comprueba los datos.';
      }
    };

    return { form, errorMessage, handleRegister };
  }
}
</script>