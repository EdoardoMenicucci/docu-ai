<template>
  <div v-if="pdfUrl" class="mx-5 flex justify-end">
    <div class="mb-5 mx-5 mt-4 justify-end">
      <embed width="500" height="760" :src="chatStore.currentPdfUrl" type='application/pdf'></embed>
    </div>
    <UIcon name="material-symbols:account-circle-outline" class="text-gray-200 text-end" mode="svg" size="2em" />
  </div>
</template>

<script lang="ts" setup>
import { useChatStore } from '~/stores/useChatStore';
import { storeToRefs } from 'pinia';
const chatStore = useChatStore();

const { pdfUrl } = storeToRefs(chatStore);
</script>

<style></style>