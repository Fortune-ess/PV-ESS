<template>
  <div class="flex flex-col min-h-screen rounded-2xl">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { onMounted } from 'vue'

onMounted(async () => {
  const authStore = useAuthStore()
  await authStore.me()
})
</script>