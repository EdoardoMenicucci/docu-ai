<template>
  <!-- CHAT -->
  <div v-if="chatStore.currentMessages" v-for="res in chatStore.currentMessages">
    <div class="flex mx-5" :class="{ 'justify-end': res.user === 'USER' }">
      <div class="w-3/4 relative text-white bg-dark-gray-900 p-5 rounded-xl border-dark-gray-500 border-2 m-4 order-1"
        :class="{ 'order-2': res.user === 'AI' }">
        <div v-html="res.text" class="">
        </div>
        <UBadge class="absolute -top-3" :class="{ 'left-1': res.user === 'USER', 'right-1': res.user === 'AI' }">
          {{ res.date }}
        </UBadge>
      </div>
      <UIcon name="material-symbols:account-circle-outline" class="text-dark-gray-200 order-2" mode="svg"
        v-if="res.user === 'USER'" size="2em" />
      <UIcon v-else name="mdi:robot-outline" class="text-dark-gray-200 order-1" mode="svg" size="2em" />

    </div>
  </div>
</template>

<script lang="ts" setup>

import { useChatStore } from '~/stores/useChatStore';

const chatStore = useChatStore();

</script>

<style></style>