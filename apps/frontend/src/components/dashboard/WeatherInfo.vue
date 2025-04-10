<script setup lang="ts">
import { useWeatherStore } from '@/store/weather'
import { computed, onBeforeUnmount, onMounted } from 'vue'

// 使用 Pinia store
const weatherStore = useWeatherStore()

// 格式化時間顯示
const formattedTime = computed(() => {
  return weatherStore.currentDateTime.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})

onMounted(() => {
  weatherStore.fetchWeatherData()
  weatherStore.startTimer()
})

onBeforeUnmount(() => {
  weatherStore.stopTimer()
})
</script>

<template>
  <div class="flex items-center gap-4 text-gray-600">
    <div class="text-sm">
      {{ formattedTime }}
    </div>
    <div class="flex items-center gap-2">
      <component
        v-if="weatherStore.currentWeather.weather"
        :is="weatherStore.weatherIcon"
        class="h-5 w-5"
        :class="weatherStore.weatherIconColor"
      />
      <span>{{ weatherStore.currentWeather.temperature }}</span>
    </div>
  </div>
</template>
