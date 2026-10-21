import { defineStore } from 'pinia';
import axios from 'axios';

// Definimos la URL exacta de tu backend en el puerto 8001
const API_URL = 'http://127.0.0.1:8001/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        async login(credentials) {
            try {
                // Usamos la URL completa para evitar que Vue Router lo intercepte
                const response = await axios.post(`${API_URL}/login`, credentials);
                
                this.token = response.data.access_token;
                this.user = response.data.user;

                // Guardar en localStorage para persistir la sesión al recargar
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                // Configurar el token globalmente para futuras peticiones
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                
                return true;
            } catch (error) {
                throw error.response?.data?.message || 'Error al iniciar sesión';
            }
        },
        async logout() {
            try {
                await axios.post(`${API_URL}/logout`, {}, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
            } catch (e) {
                console.error(e);
            } finally {
                this.token = null;
                this.user = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
            }
        },
        async register(credentials) {
            try {
                const response = await axios.post(`${API_URL}/register`, credentials);
                
                this.token = response.data.access_token;
                this.user = response.data.user;

                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                
                return true;
            } catch (error) {
                throw error.response?.data?.message || 'Error al registrar el usuario';
            }
        },
    }
});