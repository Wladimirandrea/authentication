
<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">

        <header class="mb-8 text-center">
            <router-link to="/">
                <h1 class="text-3xl font-bold text-indigo-600">
                    Sistema Laravel + Vue API
                </h1>
            </router-link>

            <p class="text-gray-600 mt-2">
                Autenticación por roles (Admin, Seller, Client)
            </p>
        </header>

        <main class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">

            <router-view />

        </main>

        <footer class="mt-8 text-center text-sm text-gray-500">
            Sistema de gestión
        </footer>

    </div>
</template>

<script>
export default {
    name: 'App'
};
</script>
