<template>
  <div class="container mx-auto mt-10">
    <div class=" max-w-96 mx-auto">
      <h1 class="text-3xl text-black text-center font-bold mb-5">Carica un file PDF</h1>
      <!-- <UInput type="file" size="sm" icon="i-heroicons-folder" @input="handleFileChange" accept="application/pdf"
        class="m-4" /> -->
      <input type="file" accept="application/pdf" @change="handleFileChange"
        class="m-4 text-brown-500 bg-accent w-full rounded-md">
      <UInput v-model="promptUtente" placeholder="Cosa vuoi estrarre?" class="m-4 w-full" />
      <UButton class="m-4" @click="uploadFile">Analizza</UButton>

    </div>
    <div class="flex justify-center mb-5">
      <embed width="600" height="800" :src="pdfUrl" type='application/pdf'></embed>
    </div>
    <div class="text-black bg-white p-5 rounded-xl border-brown-600 border-2 m-4" v-if="result" v-for="res in result"
      v-html="res">
    </div>


  </div>
</template>

<script lang="ts" setup>

// variables
const selectedFile = ref<File | null>(null);
const pdfUrl = ref("");
const promptUtente = ref("");
const result = ref<Array<string | undefined>>([]);
const previousFileName = ref<string | null>(null);
const previousPrompt = ref<string | null>(null);

// methods
const handleFileChange = (event: Event) => {

  const target = event.target as HTMLInputElement;
  result.value = [];
  previousFileName.value = null;

  if (!target || !target.files) {
    console.error('Evento non valido:', event);
    return;
  }
  console.log('Evento:', event, 'Target:', target, 'Files:', target.files, 'File:', target.files[0]);
  const file = target.files[0];

  if (!file) {
    console.error('Nessun file selezionato');
    return;
  }

  if (file.type !== 'application/pdf') {
    console.error('Il file selezionato non è un PDF');
    return;
  }

  selectedFile.value = file;
  pdfUrl.value = URL.createObjectURL(file);
  console.log('URL:', pdfUrl.value);
  console.log('File selezionato:', selectedFile.value);
};



const uploadFile = async () => {
  console.log('File selezionato:', selectedFile.value);

  let prompt = promptUtente.value;

  if (!selectedFile.value) return;

  if (previousFileName.value === selectedFile.value.name) {
    console.log('Il file è lo stesso del precedente, utilizzo il prompt precedente');
    prompt = (previousPrompt.value ?? '') + ' ' + promptUtente.value;
    previousPrompt.value = prompt; // Aggiorno il prompt concatenato
  } else {
    console.log('Il file è diverso, aggiorno il nome del file e il prompt');
    previousFileName.value = selectedFile.value.name;
    previousPrompt.value = prompt;
  }

  const formData = new FormData();

  formData.append('file', selectedFile.value);
  formData.append('promptUtente', prompt);

  try {
    console.log('try:', selectedFile.value);

    const response = await fetch('/api/upload/pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore durante l'upload: ${errorText}`);
    }

    const res = await response.json();
    result.value.push(res.body.result.response.candidates[0].content.parts[0].text);
    console.log('File caricato con successo:', result.value);
  } catch (error) {
    console.error('Errore durante l\'upload:', error);
  }
}




</script>

<style scoped></style>