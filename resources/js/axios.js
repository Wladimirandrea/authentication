import axios from 'axios';
import { useAuthStore } from './stores/auth';
import router from './router'; // Asegúrate de que la ruta a tu router sea correcta

// 1. Crear la instancia de Axios con la URL base de tu API
const api = axios.create({
    baseURL: 'http://localhost:8001/api', // Cambia esto por la URL de tu backend si es diferente
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 2. Interceptor de Petición (Request): Inyecta el token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Interceptor de Respuesta (Response): Detecta errores globales (como 401)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si el servidor responde con un 401 (No autorizado / Token caducado o inválido)
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            
            // Limpiamos el estado de autenticación y el almacenamiento local
            authStore.logoutLocal(); // O limpia manualmente localStorage si no tienes esa acción

            // Redirigimos al usuario al login de forma automática
            router.push('/login');
        }

        return Promise.reject(error);
    }
);

export default api;