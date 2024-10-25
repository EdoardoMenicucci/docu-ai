<template>

  <!-- Hero Section -->
  <section class="flex flex-col items-center text-center py-20 bg-dark-gray-900">
    <h1 class="text-5xl font-extralight mb-6">Chatta con l'IA e ottieni risposte dai tuoi documenti</h1>
    <p class="text-xl font-extralight mb-8 text-gray-300">Carica i tuoi documenti, fai domande e lascia che l'IA
      estragga le
      informazioni per te.</p>
    <NuxtLink :to="buttonRoute"><button
        class="px-6 py-3 font-extralight border border-dark-gray-700 text-white rounded-md hover:border-white hover:bg-dark-gray-700 transition-colors">Inizia
        Ora</button></NuxtLink>
  </section>

  <!-- Features Section -->
  <section class="py-20 bg-dark-gray-800">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-extralight text-center mb-12 ">Caratteristiche Principali</h2>
      <div class="flex flex-wrap -mx-4">
        <!-- Feature Card -->
        <div class="w-full md:w-1/3 px-4 mb-8 ">
          <div class="bg-dark-gray-700 rounded-md shadow-md p-6 border-dark-gray-600 border">
            <div class="mb-4">
              <svg class="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <!-- Icona personalizzata -->
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-extralight mb-2">Supporto Multi-Formato</h3>
            <p class="text-gray-300 font-extralight">Carica documenti in vari formati come PDF, Word, e altro ancora.
            </p>
          </div>
        </div>
        <!-- Repeat for other features -->
        <div class="w-full md:w-1/3 px-4 mb-8">
          <div class="bg-dark-gray-700 rounded-md shadow-md p-6">
            <div class="mb-4">
              <svg class="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <!-- Icona personalizzata -->
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-extralight mb-2">Analisi dei Dati</h3>
            <p class="text-gray-300 font-extralight">Ottieni approfondimenti dettagliati dai tuoi dati con i nostri
              strumenti
              avanzati.</p>
          </div>
        </div>

        <div class="w-full md:w-1/3 px-4 mb-8">
          <div class="bg-dark-gray-700 rounded-md shadow-md p-6">
            <div class="mb-4">
              <svg class="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-extralight mb-2">Integrazione API</h3>
            <p class="text-gray-300 font-extralight">Collega facilmente le tue applicazioni con le nostre API robuste e
              sicure.</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>

defineProps({
  buttonRoute: {
    type: String,
    required: true
  }
})

</script>

<style></style>