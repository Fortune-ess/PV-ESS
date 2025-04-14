<script setup lang="ts">
import { useWeatherStore } from '@/store/weather'
import { onBeforeUnmount, onMounted } from 'vue'

// 使用 Pinia store
const weatherStore = useWeatherStore()

// 在組件掛載時獲取天氣數據並啟動計時器
onMounted(() => {
  weatherStore.fetchWeatherData()
  weatherStore.startTimer()
})

// 組件銷毀前停止計時器
onBeforeUnmount(() => {
  weatherStore.stopTimer()
})
</script>

<template>
  <div class="space-y-4">
    <!-- 標題和時間 -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-medium text-black">
        {{ $t('main.dashboard.weather_forecast') }}
      </h2>
      <span class="text-sm text-gray-600 tabular-nums min-w-[150px] text-right">
        {{ weatherStore.currentDateTime.toLocaleDateString() }}
        {{ weatherStore.currentDateTime.toLocaleTimeString() }}
      </span>
    </div>

    <!-- 當前天氣信息 -->
    <div class="bg-white/10 rounded-xl p-4">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <div class="text-base font-medium text-black">
            {{ weatherStore.currentWeather.countyName }}
            {{ weatherStore.currentWeather.townName }}
          </div>
          <div class="text-sm text-gray-600">
            {{ weatherStore.currentDateTime.toLocaleTimeString() }}
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-2xl font-bold text-black">
              {{ weatherStore.currentWeather.temperature }}
            </div>
            <div class="text-sm text-gray-600">
              {{ weatherStore.currentWeather.weather }}
            </div>
          </div>
          <div class="text-3xl" v-if="weatherStore.currentWeather.weather">
            <component
              :is="weatherStore.weatherIcon"
              :class="weatherStore.weatherIconColor"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 天氣預報 -->
    <div
      class="grid grid-cols-5 gap-2"
      v-if="weatherStore.forecasts.length > 0"
    >
      <div
        v-for="(forecast, index) in weatherStore.forecasts"
        :key="index"
        class="flex flex-col items-center bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-all"
      >
        <div class="text-xs font-medium text-gray-600">
          {{ forecast.time }}
        </div>
        <div class="text-xl my-2">
          <component
            :is="weatherStore.getForecastIcon(forecast.icon)"
            :class="weatherStore.getForecastIconColor(forecast.icon)"
          />
        </div>
        <div class="text-sm font-medium text-black">
          {{ forecast.temperature }}
        </div>
        <div class="text-xs text-gray-600">
          {{ forecast.precipitation }}
        </div>
      </div>
    </div>
    <div v-else class="text-center py-4 text-gray-600">loading...</div>
  </div>
</template>
