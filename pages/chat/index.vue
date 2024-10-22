<template>
  <div class="bg-dark-gray-700">
    <div class="mx-auto h-screen flex flex-shrink">
      <!-- Toggle per left bar -->
      <UIcon name="mdi:menu"
        class="text-dark-gray-200 border border-dark-gray-500 rounded-md order-1 fixed left-[11rem] top-3" mode="svg"
        size="2em" @click="toggleLeftAppBar" />
      <!-- Left section -->
      <LeftAppBar :class="{ '': leftAppBar == true }" v-if="leftAppBar == true" @reset="handleReset"
        @fetchChat="allChat" :previousChat="previousChat" @chatId="fetchChat" />
      <!-- Right section -->
      <!-- 90vh overflow -->
      <div class=" max-w-[90%] mx-auto pt-5">
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
            <UIcon name="material-symbols:account-circle-outline" class="text-gray-200 text-end" mode="svg" size="2em"
              v-if="firstLoad" />
          </div>

          <!-- CHAT -->
          <div v-if="chat" v-for="res in chat">
            <div class="flex mx-5" :class="{ 'justify-end': res.user === 'USER' }">
              <div
                class="w-3/4 relative text-white bg-dark-gray-800 p-5 rounded-xl border-dark-gray-500 border-2 m-4 order-1"
                :class="{ 'order-2': res.user === 'AI' }">
                <div v-html="res.text" class="">
                </div>
                <UBadge class="absolute -top-3"
                  :class="{ 'left-1': res.user === 'USER', 'right-1': res.user === 'AI' }">
                  {{ res.date }}
                </UBadge>
              </div>
              <UIcon name="material-symbols:account-circle-outline" class="text-dark-gray-200 order-2" mode="svg"
                v-if="res.user === 'USER'" size="2em" />
              <UIcon v-else name="mdi:robot-outline" class="text-dark-gray-200 order-1" mode="svg" size="2em" />

            </div>
          </div>

          <!-- skeleton -->
          <div v-if="isUploading" class="flex mx-5">
            <UIcon name="mdi:robot-outline" class="text-gray-500 order-1" mode="svg" size="2em" />
            <div class="text-black p-5 rounded-xl bg-dark-gray-800 border-dark-gray-500 border m-4 order-1 w-3/4">
              <USkeleton class="h-10 w-[87%] mb-3" />
              <USkeleton class="h-10 w-[75%] mb-3" />
              <USkeleton class="h-10 w-[60%]" />
            </div>
          </div>
        </div>

        <!-- input component -->
        <InputText class="h-[8vh]" @change="handleChange" @sendMessage="handleSendMessage" />
      </div>


    </div>
  </div>

</template>

<script lang="ts" setup>
import { startNewChatSession, resetChat } from '@/utils/chatUtils';

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
// left bar
const leftAppBar = ref<boolean>(true);
// Session Id
const sessionId = ref<string | null>(null);
// DB CHAT
const dbChat = ref<any[any]>([]);
// previous chat
const previousChat = ref<any[any]>([]);




// Load previous chat
const fetchChat = async (id: Number) => {
  handleReset();
  try {
    const response = await fetch(`/api/chat/${id}`);
    const res = await response.json();
    console.log('Chat:', res.body.chat);
    const clickedChat = res.body.chat;
    sessionId.value = clickedChat.sessionId;
    const messages = res.body.chat.messages;
    messages.forEach((message: any) => {
      chat.value.push(
        {
          text: message.content,
          user: message.sender,
          date: '10.00'
        }
      );
    });
    console.log('Chat ref:', chat.value);

  } catch (error) {
    console.error('Errore durante il fetch della chat:', error);
  }
}


// fetch all previous chat
const allChat = async () => {
  try {
    const response = await fetch('/api/chat');
    const res = await response.json();
    previousChat.value = res.body;
    console.log('Chat:', previousChat.value);
  } catch (error) {
    console.error('Errore durante il fetch della chat:', error);
  }
}


// types

interface Chat {
  text: string;
  user: string;
  date: string;
}

// Emits

const handleChange = (file: File) => {
  resetChat(promptUtente, result, previousFileName, previousPrompt, chat);
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

const handleReset = () => {
  resetChat(promptUtente, result, previousFileName, previousPrompt, chat);
}


// methods
const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}
// left bar
const toggleLeftAppBar = () => {
  leftAppBar.value = !leftAppBar.value;
  console.log(leftAppBar.value);
}

const uploadFile = async () => {
  console.log('File selezionato:', selectedFile.value);

  if (chat.value.length === 0) {
    startNewChatSession(sessionId, chat);
  }

  if (promptUtente.value === '') {
  } else {
    chat.value.push({
      text: promptUtente.value,
      user: 'USER',
      date: getCurrentTime()
    });
  }

  isUploading.value = true;

  let prompt = promptUtente.value;

  if (!selectedFile.value) return;

  // if (previousFileName.value === selectedFile.value.name) {
  //   console.log('Il file è lo stesso del precedente, utilizzo il prompt precedente');
  //   prompt = promptUtente.value;
  //   previousPrompt.value = prompt; // Aggiorno il prompt concatenato
  // } else {
  //   console.log('Il file è diverso, aggiorno il nome del file e il prompt');
  //   previousFileName.value = selectedFile.value.name;
  //   previousPrompt.value = prompt;
  // }

  const formData = new FormData();

  formData.append('file', selectedFile.value);
  formData.append('promptUtente', prompt);
  formData.append('sessionId', sessionId.value as string);

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

    dbChat.value = (res.body.chat)
    console.log(res.body.chat);

    chat.value = [];

    dbChat.value.messages.forEach((message: any) => {
      chat.value.push(
        {
          text: message.content,
          user: message.sender,
          date: '10.00'
        }
      );
    });

    // chat.value.push({
    //   text: res.body.result.response.candidates[0].content.parts[0].text,
    //   user: 'AI',
    //   date: getCurrentTime()
    // }
    // )
    console.log('File caricato con successo:', result.value);
  } catch (error) {
    console.error('Errore durante l\'upload:', error);
  }
}




</script>

<style scoped></style>