<template>
  <div
    class="flex flex-col gap-4 bg-white/40 backdrop-blur-[30px] rounded-2xl p-4"
  >
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
