<template>
  <div class="bg-dark-gray-800">
    <div class="mx-auto h-screen flex flex-shrink">
      <!-- Toggle per left bar -->
      <UIcon name="lsicon:menu-thwartwise-outline"
        class="text-dark-gray-200 border border-dark-gray-500 rounded-md order-1 fixed left-[11rem] top-3" mode="svg"
        size="2em" @click="toggleLeftAppBar" />
      <!-- Left section -->
      <LeftAppBar :class="{ '': leftAppBarShow == true }" v-if="leftAppBarShow == true" @reset="handleReset"
        @chatId="fetchChat" />
      <!-- Right section -->
      <!-- 90vh overflow -->
      <div class=" max-w-[90%] mx-auto pt-5">
        <div class="h-[90vh] overflow-auto">
          <!-- Messaggio iniziale -->
          <div class="flex mx-5 ">
            <UIcon name="mdi:robot-outline" class="text-dark-gray-200 order-1" mode="svg" size="2em" />
            <div
              class="bg-dark-gray-900 p-5 rounded-xl border-dark-gray-500 border m-4 order-1 w-3/4 relative text-white">
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
          <div v-if="msg" v-for="res in msg">
            <div class="flex mx-5" :class="{ 'justify-end': res.user === 'USER' }">
              <div
                class="w-3/4 relative text-white bg-dark-gray-900 p-5 rounded-xl border-dark-gray-500 border-2 m-4 order-1"
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
            <div class="text-black p-5 rounded-xl bg-dark-gray-900 border-dark-gray-500 border m-4 order-1 w-3/4">
              <USkeleton class="h-10 w-[87%] mb-3" />
              <USkeleton class="h-10 w-[75%] mb-3" />
              <USkeleton class="h-10 w-[60%]" />
            </div>
          </div>
        </div>

        <!-- input component -->
        <InputText @change="handleChange" @sendMessage="handleSendMessage" class="w-[80%] mx-auto" />
      </div>


    </div>
  </div>

</template>

<script lang="ts" setup>
import { startNewChatSession, resetChat, fileUpload } from '@/utils/chatUtils';

//TODO: Add PINIA

// page meta
definePageMeta({
  middleware: 'auth',
  navigateUnauthenticatedTo: '/login'
})

// variables

const selectedFile = ref<File | null>(null);
const pdfUrl = ref("");
const promptUtente = ref("");
// Array of message of a chat to display
const msg = ref<messages[]>([]);
// If Document is loaded
const firstLoad = ref<boolean>(false);
// loader chat TODO
const isUploading = ref<boolean>(false);
// left bar TODO 
const leftAppBarShow = ref<boolean>(true);
// chat returned from the server
const dbChat = ref<any>();




// types

interface messages {
  text: string;
  user: string;
  date: string;
}

// Fetch previous chat
const fetchChat = async (id: Number) => {
  handleReset();
  try {
    const data = await $fetch(`/api/chat/${id}`);
    let messages;

    // Se la risposta non restituisce un body con errore
    if (data.body && 'chat' in data.body && data.body.chat) {
      dbChat.value = data.body.chat;
      messages = data.body.chat?.messages;
    } else {
      // Gestisci il caso di errore
      console.error(data.statusCode);
    }

    if (dbChat.value && dbChat.value?.files && dbChat.value?.files.length > 0) {
      pdfUrl.value = dbChat.value.files[0].fileUrl;
    } else {
      pdfUrl.value = '';
    }

    firstLoad.value = true;

    messages?.forEach((message: any) => {
      msg.value.push(
        {
          text: message.content,
          user: message.sender,
          date: '10.00'
        }
      );
    });
    // console.log('Chat ref:', dbChat.value);

  } catch (error) {
    console.error('Errore durante il fetch della chat:', error);
  }
}

// create chat and load file
const handleChange = async (file: File) => {
  handleReset();
  selectedFile.value = file;
  // Carico il file in upload
  pdfUrl.value = await fileUpload(file);

  try {
    // Creo la chat
    let sessionId = startNewChatSession(msg);

    const formData = new FormData();
    formData.append('sessionId', sessionId as string);
    formData.append('fileUrl', pdfUrl.value as string);

    const data = await $fetch('/api/chat', {
      method: 'POST',
      body: formData,
    });
    console.log(data);

    dbChat.value = data?.body?.chat;

  } catch (error) {
    console.error('Errore durante il fetch della chat:', error);
  }

  firstLoad.value = true;

}

const handleSendMessage = (message: string) => {
  promptUtente.value = message;
  sendMessage();
}

const handleReset = () => {
  resetChat(promptUtente, msg, dbChat);
}


const toggleLeftAppBar = () => {
  leftAppBarShow.value = !leftAppBarShow.value;
  console.log(leftAppBarShow.value);
}

const sendMessage = async () => {
  if (dbChat.value?.id == '' || pdfUrl.value) {
    // TODO: spiegare di inserire un documento prima di inviare un messaggio
    return
  }

  let chatId = dbChat.value?.id;
  let prompt = promptUtente.value;

  try {
    const formData = new FormData();

    formData.append('chatId', chatId as string);
    formData.append('prompt', prompt);

    const response = await fetch('/api/messages', {
      method: 'POST',
      body: formData
    });

    let res = await response.json();

    // Se tutto apposto si prosegue
    if (res.ok) {
      console.log('Messaggio inviato con successo');
    }

    // recupero la chat aggiornata
    const secondResponse = await fetch(`/api/chat/${chatId}`);
    res = await secondResponse.json();


    console.log(res);
    dbChat.value = (res.body.chat)
    const messages = res.body.chat.messages;
    msg.value = [];
    messages.forEach((message: any) => {
      msg.value.push(
        {
          text: message.content,
          user: message.sender,
          date: '10.00'
        }
      );
    });

  } catch (error) {
    console.error('Errore durante l\'invio del messaggio:', error);
  }
}


</script>

<style scoped></style>