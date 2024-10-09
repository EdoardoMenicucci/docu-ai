<template>
    <div class="min-h-screen flex items-center justify-center bg-background">
        <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h1 class="text-2xl font-semibold text-center mb-6 text-black">Login</h1>

            <!-- Classic Login Form -->
            <form @submit.prevent="login" class="space-y-4">
                <div>
                    <label for="email" class="block text-gray-700">Email</label>
                    <UInput type="email" v-model="email" id="email" placeholder="email@example.com" required />
                </div>

                <div>
                    <label for="password" class="block text-gray-700">Password</label>
                    <UInput type="password" v-model="password" id="password" required />
                </div>

                <button type="submit"
                    class="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition-colors">
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
                <p class="text-gray-600">Non hai un account?</p>
                <nuxt-link to="/register" class="text-teal-500 hover:text-emerald-500 transition-colors">
                    Crea un account
                </nuxt-link>
            </div>

            <!-- Social Login -->
            <div class="mt-6 space-y-3">
                <button @click="signIn('github')"
                    class="w-full flex items-center justify-center bg-gray-600 text-white py-2 rounded-md hover:bg-gray-900 transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <!-- GitHub Icon -->
                        <path fill-rule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.154-1.11-1.46-1.11-1.46-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.947 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.378.202 2.397.1 2.65.64.698 1.028 1.591 1.028 2.682 0 3.844-2.337 4.69-4.566 4.938.359.309.678.918.678 1.85 0 1.336-.012 2.415-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.523 2 12 2z"
                            clip-rule="evenodd" />
                    </svg>
                    Collegati con GitHub
                </button>

                <!-- <button @click="signIn('discord')"
            class="w-full flex items-center justify-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-800 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <Discord Icon 
              <path
                d="M20.317 4.369a19.79 19.79 0 00-4.933-1.392.071.071 0 00-.075.037 15.955 15.955 0 00-3.091 6.517 19.83 19.83 0 00-7.59 0 15.96 15.96 0 00-3.091-6.517.07.07 0 00-.075-.037 19.758 19.758 0 00-4.933 1.392.07.07 0 00-.03.106 19.874 19.874 0 002.394 2.556.07.07 0 01-.02.11c-.898.544-1.73 1.15-2.475 1.808a.07.07 0 00-.003.106 18.947 18.947 0 005.118 3.93.07.07 0 01.02.106A.072.072 0 005.017 13c-.787-.46-1.537-.968-2.236-1.52a.07.07 0 00-.103.05c-.181.923-.276 1.88-.276 2.86a.07.07 0 00.07.07h.002c.003 0 .006 0 .01 0a18.916 18.916 0 005.166 3.923.07.07 0 01.02.107c-.752.652-1.58 1.258-2.48 1.812a.07.07 0 00-.003.106c.732.742 1.58 1.415 2.48 1.966a.07.07 0 01.02.11 19.001 19.001 0 002.394-2.556.07.07 0 00-.03-.106 19.791 19.791 0 00-4.933-1.392.07.07 0 00-.075.037 15.96 15.96 0 00-3.091 6.517 19.83 19.83 0 00-7.59 0 15.955 15.955 0 00-3.091-6.517.07.07 0 00-.075-.037 19.758 19.758 0 00-4.933 1.392.07.07 0 00-.03.106 19.874 19.874 0 002.394 2.556.07.07 0 01-.02.11c-.898.544-1.73 1.15-2.475 1.808a.07.07 0 00-.003.106 18.947 18.947 0 005.118 3.93.07.07 0 01.02.106c-.787-.46-1.537-.968-2.236-1.52a.07.07 0 00-.103.05c-.181.923-.276 1.88-.276 2.86a.07.07 0 00.07.07h.002c.003 0 .006 0 .01 0a18.916 18.916 0 005.166 3.923.07.07 0 01.02.107c-.752.652-1.58 1.258-2.48 1.812a.07.07 0 00-.003.106c.732.742 1.58 1.415 2.48 1.966a.07.07 0 01.02.11 19.001 19.001 0 002.394-2.556.07.07 0 00-.03-.106 19.791 19.791 0 00-4.933-1.392.07.07 0 00-.075.037 15.96 15.96 0 00-3.091 6.517 19.83 19.83 0 00-7.59 0 15.955 15.955 0 00-3.091-6.517.07.07 0 00-.075-.037 19.758 19.758 0 00-4.933 1.392.07.07 0 00-.03.106 19.874 19.874 0 002.394 2.556.07.07 0 01-.02.11c-.898.544-1.73 1.15-2.475 1.808a.07.07 0 00-.003.106 18.947 18.947 0 005.118 3.93.07.07 0 01.02.106c-.787-.46-1.537-.968-2.236-1.52a.07.07 0 00-.103.05c-.181.923-.276 1.88-.276 2.86a.07.07 0 00.07.07h.002c.003 0 .006 0 .01 0a18.916 18.916 0 005.166 3.923.07.07 0 01.02.107c-.752.652-1.58 1.258-2.48 1.812a.07.07 0 00-.003.106c.732.742 1.58 1.415 2.48 1.966a.07.07 0 01.02.11 19.001 19.001 0 002.394-2.556.07.07 0 00-.03-.106 19.791 19.791 0 00-4.933-1.392z" />
            </svg>
            Collegati con Discord
          </button> -->

                <button v-if="status === 'authenticated'" @click="signOut"
                    class="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors">
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
    auth: {
        // unauthenticatedOnly: true,
        // navigateAutenticatedTo: '/'
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
            router.push('/')
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
input {
    color: black
}
</style>