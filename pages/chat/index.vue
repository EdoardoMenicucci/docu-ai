<template>
  <div class="bg-dark-gray-700">
    <div class="container mx-auto h-screen pt-5">
      <!-- 90vh overflow -->
      <div class="h-[90vh] overflow-auto">
        <!-- Messaggio iniziale -->
        <div class="flex mx-5 ">
          <UIcon name="mdi:robot-outline" class="text-dark-gray-200 order-1" mode="svg" size="2em" />
          <div
            class="bg-dark-gray-800 p-5 rounded-xl border-dark-gray-500 border m-4 order-1 w-3/4 relative text-white">
            Ciao! Sono il tuo assistente virtuale, <strong>carica un file PDF</strong> e chiedimi di estrarre le
            informazioni che ti servono.
          </div>
          <div>
          </div>
        </div>

        <!-- PDF DISPLAY -->
        <div v-if="firstLoad" class="mx-5 flex justify-end">
          <div class="mb-5 mx-5 mt-4 justify-end">
            <embed width="500" height="760" :src="pdfUrl" type='application/pdf'></embed>
          </div>
          <UIcon name="material-symbols:account-circle-outline" class="text-gray-500 text-end" mode="svg" size="2em"
            v-if="firstLoad" />
        </div>

        <!-- CHAT -->
        <div v-if="chat" v-for="res in chat">
          <div class="flex mx-5" :class="{ 'justify-end': res.user === 'user' }">
            <div
              class="w-3/4 relative text-white bg-dark-gray-800 p-5 rounded-xl border-dark-gray-500 border-2 m-4 order-1"
              :class="{ 'order-2': res.user === 'bot' }">
              <div v-html="res.text" class="">
              </div>
              <UBadge class="absolute -top-3" :class="{ 'left-1': res.user === 'user', 'right-1': res.user === 'bot' }">
                {{ res.date }}
              </UBadge>
            </div>
            <UIcon name="material-symbols:account-circle-outline" class="text-dark-gray-200 order-2" mode="svg"
              v-if="res.user === 'user'" size="2em" />
            <UIcon v-else name="mdi:robot-outline" class="text-dark-gray-200 order-1" mode="svg" size="2em" />

          </div>
        </div>

        <!-- skeleton -->
        <div v-if="isUploading" class="flex mx-5">
          <UIcon name="mdi:robot-outline" class="text-gray-500 order-1" mode="svg" size="2em" />
          <div class="text-black bg-white p-5 rounded-xl border-brown-600 border-2 m-4 order-1 w-3/4">
            <USkeleton class="h-10 w-[87%] mb-3" />
            <USkeleton class="h-10 w-[75%] mb-3" />
            <USkeleton class="h-10 w-[60%]" />
          </div>
        </div>
      </div>




      <!-- INPUT FIXED -->
      <!-- <div class="fixed bottom-5 left-1/4 container mx-auto p-5 flex justify-center w-1/2"> -->
      <!-- <input type="file" accept="application/pdf" @change="handleFileChange" -->
      <!-- class="m-4 text-brown-500 bg-accent rounded-md"> -->
      <!-- <UInput v-model="promptUtente" placeholder="Cosa vuoi estrarre?" class="m-4 w-full" />
      <UButton class="m-4" @click="uploadFile">Analizza</UButton>
      <UButton class="m-4" @click="reset" variant="solid" icon="material-symbols:reset-shadow"></UButton>
      </div> -->

      <!-- input component -->
      <InputText @change="handleChange" @sendMessage="handleSendMessage" />



    </div>
  </div>

</template>

<script lang="ts" setup>
// page meta
definePageMeta({
  middleware: 'auth',
  navigateUnauthenticatedTo: '/login'
})

// variables
const selectedFile = ref<File | null>(null);
const pdfUrl = ref("");
const promptUtente = ref("");
const result = ref<Array<string | undefined>>([]);
const previousFileName = ref<string | null>(null);
const previousPrompt = ref<string | null>(null);
const chat = ref<Chat[]>([]);
const firstLoad = ref<boolean>(false);
const isUploading = ref<boolean>(false);


// types
interface Chat {
  text: string;
  user: string;
  date: string;
}

// Emits

const handleChange = (file: File) => {
  reset();
  selectedFile.value = file;
  firstLoad.value = true;
  pdfUrl.value = URL.createObjectURL(file);
  console.log('URL:', pdfUrl.value);
  console.log('File selezionato:', selectedFile.value);
}

const handleSendMessage = (message: string) => {
  promptUtente.value = message;
  uploadFile();
}


// methods
const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

const reset = () => {
  promptUtente.value = "";
  result.value = [];
  previousFileName.value = null;
  previousPrompt.value = null;
  chat.value = [];
}

const uploadFile = async () => {
  console.log('File selezionato:', selectedFile.value);

  if (promptUtente.value === '') {

  } else {
    chat.value.push({
      text: promptUtente.value,
      user: 'user',
      date: getCurrentTime()
    });
  }

  isUploading.value = true;

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
    isUploading.value = false;
    result.value.push(res.body.result.response.candidates[0].content.parts[0].text);
    chat.value.push({
      text: res.body.result.response.candidates[0].content.parts[0].text,
      user: 'bot',
      date: getCurrentTime()
    }
    )
    console.log('File caricato con successo:', result.value);
  } catch (error) {
    console.error('Errore durante l\'upload:', error);
  }
}




</script>

<style scoped></style>