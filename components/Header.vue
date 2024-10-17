<template>
  <div>
    <div class="container mx-auto text-2x text-text flex justify-between items-center h-14">
      <div>Logo</div>
      <div>
        <NuxtLink v-if="status === 'unauthenticated'" to="/login" class="mr-4">
          <button class="bg-primaryb rounded text-white p-2">LogIn</button>
        </NuxtLink>
        <button v-else class="bg-primaryb hover:bg-accent rounded text-white p-2" @click="signOut()">LogOut</button>
      </div>
    </div>
  </div>

  <!-- {{ data.user }} -->
  <!-- {{ status }} , {{ data?.user }} -->
</template>

<script lang="ts" setup>
const { status, signOut, data } = useAuth()

</script>

<style></style>