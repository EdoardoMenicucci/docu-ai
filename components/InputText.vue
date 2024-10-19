<template>
  <div class="flex items-center p-4 border-t">
    <label for="file-upload" class="cursor-pointer text-dark-gray-200 hover:text-gray-100 mr-2">
      <!-- Icona per caricare file -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 16v4H8v-4H5l7-7 7 7h-3z" />
      </svg>
      <input id="file-upload" type="file" accept="application/pdf" class="hidden" @change="onFileSelected" />
    </label>

    <textarea v-model="message" ref="messageInput" @input="autoResize" rows="1" placeholder="Scrivi il tuo messaggio..."
      class="resize-none overflow-hidden w-full p-2 border border-dark-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gray-400"></textarea>

    <button @click="handleSendMessage"
      class="ml-2 px-6 py-2 border border-dark-gray-500 text-white rounded-md hover:border-white hover:bg-dark-gray-500 transition-colors">
      <!-- Icona per inviare il messaggio -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l9-9m0 0l9 9M12 1v22" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';

const emit = defineEmits(['change', 'messageChange', 'sendMessage']);

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

  if (file) {
    emit('change', file);
  }
};

onMounted(() => {
  autoResize();
});
</script>

<style scoped>
/* Aggiungi eventuali stili personalizzati qui */
</style>
