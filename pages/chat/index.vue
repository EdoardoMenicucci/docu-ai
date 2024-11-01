<template>
  <div class="bg-dark-gray-800">
    <div class="mx-auto h-screen flex flex-shrink">

      <!-- Toggle button left bar -->
      <UIcon name="lsicon:menu-thwartwise-outline"
        class="text-dark-gray-200 border border-dark-gray-500 rounded-md order-1 fixed left-[11rem] top-3" mode="svg"
        size="2em" @click="toggleLeftAppBar" />

      <!-- Left section -->
      <LeftAppBar :class="{ '': leftAppBarShow == true }" v-if="leftAppBarShow == true" @reset="chatStore.handleReset"
        @chatId="chatStore.fetchChat" />

      <!-- Right section -->
      <!-- 90vh overflow Chat Body -->
      <ChatBody />

      <!-- If no file selected Modal -->
      <UModal v-model="chatStore.fileSet">
        <div class="p-4">
          <p class="text-center">Seleziona un file PDF per inviare un messaggio</p>
        </div>
      </UModal>


    </div>
  </div>

</template>

<script lang="ts" setup>
import { useChatStore } from '~/stores/useChatStore';
//pinia store
const chatStore = useChatStore();

// page meta
definePageMeta({
  middleware: 'auth',
  navigateUnauthenticatedTo: '/login'
})

// left bar 
const leftAppBarShow = ref<boolean>(true);

// toggle left bar
const toggleLeftAppBar = () => {
  leftAppBarShow.value = !leftAppBarShow.value;
  console.log(leftAppBarShow.value);
}



</script>

<style scoped></style>