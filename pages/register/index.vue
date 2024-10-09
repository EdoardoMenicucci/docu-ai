<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')

const register = async () => {
  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    alert('Registrazione completata. Ora puoi effettuare il login.')
    router.push('/login')
  } catch (error) {
    alert(error.data.message)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-black">Registrati</h1>
      <form @submit.prevent="register" class="space-y-4">
        <div>
          <UInput v-model="email" type="email" placeholder="Email" required />
        </div>
        <div>
          <UInput v-model="password" type="password" placeholder="Password" required />
        </div>
        <button type="submit" class=" bg-primaryb text-white p-2 rounded-md hover:bg-accent transition duration-300">
          Registrati
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
input {
  color: black
}
</style>