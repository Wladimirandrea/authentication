import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import SellerDashboard from '../views/seller/SellerDashboard.vue';
import ClientDashboard from '../views/client/ClientDashboard.vue';
import Home from '../views/Home.vue';

// ========================================
// PÁGINA PRINCIPAL PÚBLICA
// ========================================


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