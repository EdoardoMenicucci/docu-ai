<template>
  <section class="py-20 bg-dark-gray-800 font-extralight">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-4xl mb-6">Pronto a Iniziare?</h2>
      <p class="text-xl mb-8 text-gray-300">Registrati oggi e scopri il potenziale della nostra IA.</p>
      <NuxtLink :to="buttonRoute"><button
          class="px-6 py-3 border border-dark-gray-700 text-white rounded-md hover:border-white hover:bg-dark-gray-700 transition-colors">Prova
          Gratis</button>
      </NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineProps(['buttonRoute'])
</script>

<style></style>