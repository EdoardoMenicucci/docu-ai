<template>
  <div class="w-[20rem] bg-dark-gray-900 pt-5 flex-shrink-0 flex flex-col">
    <NuxtLink to="/" class="">
      <div class="flex w-full hover:bg-dark-gray-800 py-2 items-center ps-2">
        <UIcon name="material-symbols-light:arrow-back-rounded" class="text-dark-gray-200 mx-1" mode="svg"
          size="1.5em" />
        <div class="font-thin">
          Back
        </div>
      </div>
    </NuxtLink>
    <NuxtLink class="" @click="handleReset">
      <div class="flex w-full hover:bg-dark-gray-800 py-2 items-center ps-2">
        <UIcon name="material-symbols-light:delete-sweep-outline" class="text-dark-gray-200 mx-1" mode="svg"
          size="1.5em" />
        <div class="font-extralight">
          Reset
        </div>
      </div>
    </NuxtLink>
    <div class="" @click="handleFetch">
      <div class="flex w-full hover:bg-dark-gray-800 py-2 items-center ps-2 mb-2">
        <UIcon name="lets-icons:folder-search-duotone-line" class="text-dark-gray-200 mx-1" mode="svg" size="1.5em" />
        <div class="font-extralight">
          Previos chat
        </div>
      </div>
    </div>
    <!-- <div v-if="stato == 'success'" @click="handleChatId(chat.id)" v-for="chat in previousChat" :key="chat.id">
      <div class="flex w-full hover:bg-dark-gray-800 py-2 items-center ps-2">
        <div class="">
          {{ getShortString(chat?.messages[0]?.content || 'No Content') }}
        </div>
      </div>
    </div> -->
    <div v-if="chatLoading">
      caricamento...
    </div>
    <div v-else v-for="chat in chatState.chat">
      <div @click="handleChatId(chat.id)" class="flex w-full hover:bg-dark-gray-800 py-2 items-center ps-2">
        <div>
          {{ getShortString(chat.messages[0]?.content || 'No Content') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
onMounted(() => {
  fetchChats()
})
// Fetch previous chat using composable w/ useState()
const chatState = useChatState()
const chatLoading = ref(true)


// Using directly chatState.isLoading on template cause hydratation warning
watch(
  () => chatState.value.isLoading,
  (newValue) => {
    chatLoading.value = newValue
    if (newValue) {
      console.log('Chat is loading...')
    } else {
      console.log('Chat loading completed.')
    }
  }
)




// chatLoading.value = chatState.value.isLoading





const emit = defineEmits(['reset', 'fetchChat', 'chatId']);


// Handle Emits
const handleReset = () => {
  emit('reset');
};

const handleFetch = () => {
  emit('fetchChat');
};

const handleChatId = (id: number) => {
  emit('chatId', id);
};

//funzione per prendere una stringa di massimo 10 caratteri
const getShortString = (str: string) => {
  return str.length > 20 ? str.substring(0, 20) + '...' : str;
};

</script>

<style></style>