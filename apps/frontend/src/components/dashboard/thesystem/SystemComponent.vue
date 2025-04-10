<template>
  <div class="rounded-lg p-3 flex flex-col relative">
    <h3 class="text-black text-sm font-medium mb-2">
      {{ title }}
    </h3>
    <div class="flex items-center justify-center">
      <div
        :class="[
          'border-2 border-dashed rounded-xl p-2 relative z-10',
          getBorderColor(status),
        ]"
      >
        <component :is="icon" :status="status" class="w-16 h-16" />
      </div>
    </div>
    <div
      class="text-center text-xs mt-1 font-medium"
      :class="{
        'text-green-500': status === 'normal',
        'text-yellow-400': status === 'warning',
        'text-red-300': status === 'error',
      }"
    >
      {{ $t(`main.dashboard.${status}`) }}
    </div>
    <div class="text-black text-xs mt-2">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/store/systemStore'

const props = defineProps<{
  title: string
  status: string
  icon: any
}>()

const { getBorderColor } = useSystemStore()
</script>
