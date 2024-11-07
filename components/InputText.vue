<template>
  <div class="flex items-center justify-between bg-dark-gray-900 relative  border-dark-gray-500 border rounded-xl">
    <label for="file-upload" class="cursor-pointer text-dark-gray-200 hover:text-gray-100 mx-2">
      <!-- Icona per caricare file -->
      <UIcon name="material-symbols:upload" class="text-dark-gray-200" mode="svg" size="1.5em" />
      <input id="file-upload" type="file" accept="application/pdf" class="hidden" @change="onFileSelected" />
    </label>

    <textarea v-model="message" @keydown="handleKeyDown" ref="messageInput" @input="autoResize" rows="1"
      placeholder="Scrivi il tuo messaggio..."
      class="resize-none overflow-auto w-full max-h-[110px] p-2 bg-dark-gray-900 rounded-md focus:outline-none focus:ring-0 focus:ring-dark-gray-900"></textarea>

    <button @click="handleSendMessage" class="ml-2 px-6 py-1.5 text-white  transition-colors ">
      <!-- Icona per inviare il messaggio -->
      <UIcon name="iconamoon:send-thin" class="text-white" mode="svg" size="1.5em" />
    </button>
  </div>
</template>

<script setup lang="ts">

// const { startUpload } = useUploadThing('pdfUploader', {
//   onClientUploadComplete(res) {
//     console.log(`onClientUploadComplete`, res);
//     console.log('pdf url:', res[0].url);
//     if (res[0].url) {
//       emit('change', res[0].url);
//     }
//     alert("Upload Completed");
//   },
// });

const alert = (msg: string) => {
  window.alert(msg);
};

const emit = defineEmits(['change', 'sendMessage']);

const message = ref('');
const messageInput = ref<HTMLTextAreaElement | null>(null);

const autoResize = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto';
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px';
  }
};

const handleSendMessage = () => {
  // Logica per inviare il messaggio
  console.log('Messaggio inviato:', message.value);
  emit('sendMessage', message.value);
  message.value = '';
  nextTick(() => {
    autoResize();
  });
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSendMessage();
  }
};


const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;

  if (!target || !target.files) {
    console.error('Evento non valido:', event);
    return;
  }


  if (!file) {
    console.error('Nessun file selezionato');
    return;
  }

  if (file.type !== 'application/pdf') {
    console.error('Il file selezionato non è un PDF');
    return;
  }

  emit('change', file);
};

onMounted(() => {
  autoResize();
});
</script>

<style scoped></style>
