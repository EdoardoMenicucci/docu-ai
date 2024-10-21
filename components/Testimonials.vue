<template>
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
        <!-- other -->

      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>

</script>

<style></style>