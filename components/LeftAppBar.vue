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
    <div v-if="previousChat?.chat" @click="handleChatId(chat.id)" v-for="chat in previousChat?.chat" :key="chat.id">
      <div class="flex w-full hover:bg-dark-gray-800 py-2 items-center ps-2">
        <div class="">
          {{ getShortString(chat?.messages[0]?.content || 'No Content') }}
        </div>
      </div>
    </div>
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