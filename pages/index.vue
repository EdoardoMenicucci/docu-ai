<template>
  <div class="container mx-auto mt-10">
    <div class=" max-w-96 mx-auto">
      <h1 class="text-3xl text-black text-center font-bold">Carica un documento</h1>
      <UInput type="file" class="m-4" />
      <UInput placeholder="Cosa vuoi estrarre?" class="m-4" />
      <embed src="/uploads/Bool.pdf" type='application/pdf'></embed>
    </div>

  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>