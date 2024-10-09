<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <div>Nome: {{ data.user.name }}</div>
    <div>email: {{ data.user.email }}</div>
  </div>
</template>

<script lang="ts" setup>
const { data } = useAuth()
</script>

<style></style>