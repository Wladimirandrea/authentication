import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import SellerDashboard from '../views/seller/SellerDashboard.vue';
import ClientDashboard from '../views/client/ClientDashboard.vue';

// ========================================
// PÁGINA PRINCIPAL PÚBLICA
// ========================================
const Home = {
    template: `
        <div class="text-center">

            <h1 class="text-3xl font-bold text-indigo-600 mb-4">
                Bienvenido a nuestra aplicación
            </h1>

            <p class="text-gray-600 mb-6">
                Gestiona tu cuenta y accede a nuestros servicios.
            </p>

            <div class="flex justify-center gap-4">

                <router-link
                    to="/login"
                    class="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700"
                >
                    Iniciar sesión
                </router-link>
                <router-link to="/register" class="text-sm text-indigo-600 hover:underline">¿No tienes cuenta? Regístrate aquí</router-link>

            </div>

        </div>
    `
};

// ========================================
// OBTENER DASHBOARD SEGÚN EL ROL
// ========================================
function getDashboardByRole(role) {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';

        case 'seller':
            return '/seller/dashboard';

        case 'client':
            return '/client/dashboard';

        default:
            return '/';
    }
}

// ========================================
// DEFINICIÓN DE RUTAS
// ========================================
const routes = [
    // Página principal pública
    {
        path: '/',
        name: 'Home',
        component: Home
    },

    // Register
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            guestOnly: true
        }
    },

    // Login
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            guestOnly: true
        }
    },

    // Administrador
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
            requiresAuth: true,
            role: ['admin']
        }
    },

    // Vendedor y administrador
    {
        path: '/seller/dashboard',
        name: 'SellerDashboard',
        component: SellerDashboard,
        meta: {
            requiresAuth: true,
            role: ['admin', 'seller']
        }
    },

    // Cliente
    {
        path: '/client/dashboard',
        name: 'ClientDashboard',
        component: ClientDashboard,
        meta: {
            requiresAuth: true,
            role: ['client']
        }
    },

    // Página no encontrada
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/'
    }
];

// ========================================
// CREAR ROUTER
// ========================================
const router = createRouter({
    history: createWebHistory(),
    routes
});

// ========================================
// GUARD DE AUTENTICACIÓN Y ROLES
// ========================================
router.beforeEach((to) => {
    const authStore = useAuthStore();

    const isAuthenticated = Boolean(authStore.token);
    const userRole = authStore.user?.role;

    // Usuario no autenticado intenta entrar a una ruta protegida
    if (to.meta.requiresAuth && !isAuthenticated) {
        return {
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        };
    }

    // Usuario autenticado intenta entrar al login o register
    if (to.meta.guestOnly && isAuthenticated) {
        return getDashboardByRole(userRole);
    }

    // Comprobar permisos por rol
    if (to.meta.role && isAuthenticated) {
        const allowedRoles = Array.isArray(to.meta.role)
            ? to.meta.role
            : [to.meta.role];

        if (!allowedRoles.includes(userRole)) {
            return getDashboardByRole(userRole);
        }
    }

    return true;
});

export default router;