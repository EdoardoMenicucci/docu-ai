<template>
    <div class="min-h-screen flex items-center justify-center bg-dark-gray-800">
        <div class="w-full max-w-md bg-dark-gray-900 p-8 rounded-lg shadow-md text-gray-200">
            <h1 class="text-2xl font-semibold text-center mb-6">Login</h1>

            <!-- Classic Login Form -->
            <form @submit.prevent="login" class="space-y-4">
                <div>
                    <label for="email" class="block">Email</label>
                    <input type="email" v-model="email" id="email" placeholder="email@example.com" required
                        class="w-full rounded-md bg-dark-gray-800 border border-dark-gray-500 text-white p-2" />
                </div>

                <div>
                    <label for="password" class="block">Password</label>
                    <input type="password" v-model="password" id="password" required
                        class="w-full rounded-md bg-dark-gray-800 border border-dark-gray-500 p-2" />
                </div>

                <button type="submit"
                    class="w-full px-6 py-3 border border-dark-gray-500 text-white rounded-md hover:border-white hover:bg-dark-gray-700 transition-colors">
                    Accedi
                </button>
            </form>

            <!-- Display Errors -->
            <div v-if="errors.length" class="mt-4 space-y-2">
                <div v-for="error in errors" class="text-red-600 text-center">
                    {{ error }}
                </div>
            </div>

            <!-- Signup Link -->
            <div class="mt-6 text-center">
                <p class="text-gray-400">Non hai un account?</p>
                <nuxt-link to="/register" class="text-gray-200 hover:text-white transition-colors">
                    Crea un account
                </nuxt-link>
            </div>

            <!-- Social Login -->
            <div class="mt-6 space-y-3">
                <button @click="signIn('github')"
                    class="w-full flex items-center justify-center px-6 py-3 border border-dark-gray-500 text-white rounded-md hover:border-white hover:bg-dark-gray-700 transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <!-- GitHub Icon -->
                        <path fill-rule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.154-1.11-1.46-1.11-1.46-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.947 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.378.202 2.397.1 2.65.64.698 1.028 1.591 1.028 2.682 0 3.844-2.337 4.69-4.566 4.938.359.309.678.918.678 1.85 0 1.336-.012 2.415-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.523 2 12 2z"
                            clip-rule="evenodd" />
                    </svg>
                    Collegati con GitHub
                </button>
                <button v-if="status === 'authenticated'" @click="signOut"
                    class="w-full px-6 py-3 border border-dark-gray-500 text-white rounded-md hover:border-white hover:bg-dark-gray-700 transition-colors">
                    Log Out
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// import { signIn } from '#auth'

const { signOut, signIn, status } = useAuth()


definePageMeta({
    middleware: 'auth',
    auth: {
        unauthenticatedOnly: true,
        navigateAutenticatedTo: '/chat'
    }
})

const errors = ref([]);

const login = async () => {
    errors.value = [];
    try {
        const res = await signIn('credentials', {
            redirect: false,
            email: email.value,
            password: password.value
        })

        console.log(res);


        if (res?.error) {
            alert('Errore: ' + res.error)
            errors.value.push(res.error)
        } else if (res?.ok) {
            // Login riuscito
            router.push('/chat')
        } else {
            alert('Credenziali non valide')
            errors.value.push('Credenziali non valide')
        }
        console.log(errors.value);

    } catch (error) {
        console.error('Errore durante il login:', error)
        alert('Si è verificato un errore durante il login.')
    }
}

const email = ref('')
const password = ref('')

</script>

<style scoped>
input:-webkit-autofill {
    background-color: #020303 !important;
    /* bg-dark-gray-800 */
    color: #fff !important;
    /* text-white */
}

input:-moz-autofill {
    background-color: #07090c !important;
    /* bg-dark-gray-800 */
    color: #fff !important;
    /* text-white */
}

input:-ms-autofill {
    background-color: #000000 !important;
    /* bg-dark-gray-800 */
    color: #fff !important;
    /* text-white */
}

input:-o-autofill {
    background-color: #000000 !important;
    /* bg-dark-gray-800 */
    color: #fff !important;
    /* text-white */
}

input:autofill {
    background-color: #000000 !important;
    /* bg-dark-gray-800 */
    color: #fff !important;
    /* text-white */
}
</style>