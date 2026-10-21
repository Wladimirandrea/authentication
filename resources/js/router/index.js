
import {
    createRouter,
    createWebHistory,
    useRouter
} from 'vue-router';

import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

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
// DASHBOARD DE ADMINISTRADOR
// ========================================
const AdminDashboard = {
    template: `
        <div class="text-center">

            <h2 class="text-xl font-bold text-red-600 mb-2">
                Panel de Administrador
            </h2>

            <p class="text-gray-600 mb-4">
                Control total del sistema.
            </p>

            <button
                @click="logout"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Cerrar Sesión
            </button>

        </div>
    `,

    setup() {
        const authStore = useAuthStore();
        const router = useRouter();

        const logout = async () => {
            await authStore.logout();
            router.replace('/login');
        };

        return { logout };
    }
};

// ========================================
// DASHBOARD DE VENDEDOR
// ========================================
const SellerDashboard = {
    template: `
        <div class="text-center">

            <h2 class="text-xl font-bold text-blue-600 mb-2">
                Panel de Vendedor (Seller)
            </h2>

            <p class="text-gray-600 mb-4">
                Gestión de productos y ventas.
            </p>

            <button
                @click="logout"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Cerrar Sesión
            </button>

        </div>
    `,

    setup() {
        const authStore = useAuthStore();
        const router = useRouter();

        const logout = async () => {
            await authStore.logout();
            router.replace('/login');
        };

        return { logout };
    }
};

// ========================================
// DASHBOARD DE CLIENTE
// ========================================
const ClientDashboard = {
    template: `
        <div class="text-center">

            <h2 class="text-xl font-bold text-green-600 mb-2">
                Panel de Cliente (Client)
            </h2>

            <p class="text-gray-600 mb-4">
                Tus compras y perfil.
            </p>

            <button
                @click="logout"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Cerrar Sesión
            </button>

        </div>
    `,

    setup() {
        const authStore = useAuthStore();
        const router = useRouter();

        const logout = async () => {
            await authStore.logout();
            router.replace('/login');
        };

        return { logout };
    }
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

    // Usuario no autenticado intenta entrar
    // a una ruta protegida
    if (to.meta.requiresAuth && !isAuthenticated) {
        return {
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        };
    }

    // Usuario autenticado intenta entrar al login
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
