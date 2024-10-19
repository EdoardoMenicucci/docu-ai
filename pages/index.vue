<template>
  <div class="min-h-screen bg-dark-gray-900 text-white">
    <!-- App Bar -->
    <nav class="bg-dark-gray-800 px-6 py-4 flex items-center justify-between shadow-md">
      <div class="text-2xl font-bold">Docu AI</div>
      <div class="space-x-4">
        <NuxtLink to="#" class="text-gray-300 hover:text-white">Home</NuxtLink>
        <NuxtLink to="#" class="text-gray-300 hover:text-white">Contatti</NuxtLink>
      </div>
    </nav>

    <Jumbo :buttonRoute="buttonRoute" />

    <!-- Testimonials Section -->
    <section class="py-20 bg-dark-gray-900">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Cosa Dicono i Nostri Utenti</h2>
        <div class="flex flex-wrap -mx-4">
          <!-- Testimonial Card -->
          <div v-for="i in 3" class="w-full md:w-1/3 px-4 mb-8">
            <div class="bg-dark-gray-800 rounded-md shadow-md p-6 border-dark-gray-600 border">
              <p class="text-gray-400">"Questo servizio ha rivoluzionato il nostro modo di lavorare con i documenti."
              </p>
              <div class="mt-4 text-right text-gray-300 font-semibold">- Marco Bianchi</div>
            </div>
          </div>
          <!-- Repeat for other testimonials -->
          <!-- ... -->
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-20 bg-dark-gray-800">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold mb-6">Pronto a Iniziare?</h2>
        <p class="text-xl mb-8 text-gray-400">Registrati oggi e scopri il potenziale della nostra IA.</p>
        <NuxtLink :to="buttonRoute"><button
            class="px-6 py-3 border border-dark-gray-700 text-white rounded-md hover:border-white hover:bg-dark-gray-700 transition-colors">Prova
            Gratis</button>
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-6 bg-dark-gray-900 text-gray-400">
      <div class="container mx-auto px-6 flex flex-wrap items-center justify-between">
        <div>&copy; 2023 Docu AI.</div>
        <div class="space-x-4">
          <a href="#" class="hover:text-white">Chi Siamo</a>
          <a href="#" class="hover:text-white">Contatti</a>
          <a href="#" class="hover:text-white">Privacy Policy</a>
          <a href="#" class="hover:text-white">Termini di Servizio</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Auth -> Chat Route
const { status } = useAuth()
const buttonRoute = ref('/login')

onMounted(() => {
  if (status.value === 'authenticated') {
    buttonRoute.value = '/chat'
  } else {
    buttonRoute.value = '/login'
  }
})

</script>

<style></style>
