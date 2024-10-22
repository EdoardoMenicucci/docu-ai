<template>
  <div class="w-[20rem] bg-dark-gray-800 pt-5 flex-shrink-0 flex flex-col">
    <NuxtLink to="/" class="">
      <div class="flex w-full hover:bg-dark-gray-500 py-2 items-center ps-2">
        <UIcon name="material-symbols:arrow-back" class="text-dark-gray-200 mx-1" mode="svg" size="1.5em" />
        <div class="">
          Back
        </div>
      </div>
    </NuxtLink>
    <NuxtLink to="#" class="" @click="handleReset">
      <div class="flex w-full hover:bg-dark-gray-500 py-2 items-center ps-2">
        <UIcon name="material-symbols:refresh" class="text-dark-gray-200 mx-1" mode="svg" size="1.5em" />
        <div class="">
          Reset
        </div>
      </div>
    </NuxtLink>
    <NuxtLink to="#" class="" @click="handleFetch">
      <div class="flex w-full hover:bg-dark-gray-500 py-2 items-center ps-2">
        <UIcon name="material-symbols:refresh" class="text-dark-gray-200 mx-1" mode="svg" size="1.5em" />
        <div class="">
          Previos chat
        </div>
      </div>
    </NuxtLink>
    <hr>
    <NuxtLink class="" @click="handleChatId(chat.id)" v-for="chat in previousChat?.chat">
      <div class="flex w-full hover:bg-dark-gray-500 py-2 items-center ps-2">
        <div class="">
          {{ getShortString(chat.messages[0].content) }}
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>

const emit = defineEmits(['reset', 'fetchChat', 'chatId']);

defineProps({
  previousChat: Object,
});

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