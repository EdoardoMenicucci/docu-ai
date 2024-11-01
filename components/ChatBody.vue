<template>
  <div class=" max-w-[90%] mx-auto pt-5">
    <div class="h-[90vh] overflow-auto">
      <!-- Messaggio iniziale -->
      <div class="flex mx-5 ">
        <UIcon name="mdi:robot-outline" class="text-dark-gray-200 order-1" mode="svg" size="2em" />
        <div class="bg-dark-gray-900 p-5 rounded-xl border-dark-gray-500 border m-4 order-1 w-3/4 relative text-white">
          Ciao! Sono il tuo assistente virtuale, <strong>carica un file PDF</strong> e chiedimi di estrarre le
          informazioni che ti servono.
        </div>
        <div>
        </div>
      </div>

      <!-- PDF DISPLAY -->
      <PdfChatSection />

      <!-- Messages -->
      <MessagesList />


      <!-- skeleton -->
      <!-- <div v-if="isUploading" class="flex mx-5">
            <UIcon name="mdi:robot-outline" class="text-gray-500 order-1" mode="svg" size="2em" />
            <div class="text-black p-5 rounded-xl bg-dark-gray-900 border-dark-gray-500 border m-4 order-1 w-3/4">
              <USkeleton class="h-10 w-[87%] mb-3" />
              <USkeleton class="h-10 w-[75%] mb-3" />
              <USkeleton class="h-10 w-[60%]" />
            </div>
          </div> -->
    </div>

    <!-- input component -->
    <InputText @change="handleFileChange" @sendMessage="handleSendMessage" class="w-[80%] mx-auto" />
  </div>
</template>

<script lang="ts" setup>

import { useChatStore } from '~/stores/useChatStore';
const chatStore = useChatStore();

// Gestione del file
const handleFileChange = (event: File) => {
  console.log(event);
  chatStore.handleChange(event);
};

const handleSendMessage = (msg: string) => {
  chatStore.handleSendMessage(msg);
}
</script>

<style></style>