<template>
  <div class="min-h-screen bg-dark-gray-900 text-white">
    <!-- App Bar -->
    <nav class="bg-dark-gray-800 px-6 py-4 flex items-center justify-between shadow-md">
      <div class="text-2xl font-bold">Docu AI</div>
      <div class="space-x-4">
        <NuxtLink to="#" class="text-gray-300 hover:text-white">Home</NuxtLink>
        <NuxtLink to="#" class="text-gray-300 hover:text-white">Contatti</NuxtLink>
        <NuxtLink v-if="status === 'authenticated'" to="#" @click="signOut" class="text-gray-300 hover:text-white">Sign
          Out</NuxtLink>
        <NuxtLink v-else to="/login" class="text-gray-300 hover:text-white">Sign In</NuxtLink>

      </div>
    </nav>

    <Jumbo :buttonRoute="buttonRoute" />

    <!-- Testimonials Section -->
    <Testimonials />

    <!-- Call to Action Section -->
    <CallToAction :buttonRoute="buttonRoute" />

    <!-- Footer -->
    <Footer />

  </div>
</template>

<script setup lang="ts">
// Auth -> Chat Route
const { status, signOut } = useAuth()
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
