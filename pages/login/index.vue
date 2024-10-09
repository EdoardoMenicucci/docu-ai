<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="bg-background p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
            <button @click="signIn('github')"
                class="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                Login with GitHub
            </button>
            <!-- <button @click=""
                class="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                Login with Discors
            </button> -->
        </div>

    </div>
    <pre>
            {{ status }}
    </pre>
</template>

<script lang="ts" setup>
const { signOut, signIn, data, status } = useAuth()

definePageMeta({
    middleware: 'auth',
    auth: {
        unauthenticatedOnly: true,
        navigateAutenticatedTo: '/',
    }
})

</script>

<style scoped>
/* Add your styles here */
</style>