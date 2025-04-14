<script setup lang="ts">
import { useDataStore } from '@/store/data'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const dataStore = useDataStore()
const constants = dataStore.constants
const timeIntervals = dataStore.timeIntervals
const simulatedData = dataStore.getSimulatedDataForDate('2023-09-30', true)
const currentTimeIndex = ref(0)
const maxTimeIndex = timeIntervals.length - 1

const currentSoCPercentage = computed(() => {
  if (currentTimeIndex.value > maxTimeIndex) return 100
  const currentSoC = simulatedData[currentTimeIndex.value]?.data.soc || 0
  return Math.round((currentSoC / constants.BSC) * 100)
})

// 電池充電模擬計時器
let batteryChargingTimer: number | undefined

onMounted(() => {
  batteryChargingTimer = window.setInterval(() => {
    if (currentTimeIndex.value < maxTimeIndex) {
      currentTimeIndex.value++
    } else {
      clearInterval(batteryChargingTimer)
    }
  }, 1000)
})

onUnmounted(() => {
  if (batteryChargingTimer) {
    clearInterval(batteryChargingTimer)
  }
})
</script>

<template>
  <div class="mb-4 bg-[#b8f719] rounded-lg p-2">
    <div
      class="flex flex-col sm:flex-row justify-between text-black text-sm mb-2"
    >
      <span class="mb-1 sm:mb-0">
        {{ $t('main.dashboard.total_energy') }}: {{ constants.BSC }}MWh
      </span>
      <span>
        {{ $t('main.dashboard.current_charge') }}: {{ currentSoCPercentage }}%
      </span>
    </div>
    <div class="w-full bg-gray-300/40 rounded-full h-2 overflow-hidden">
      <div
        class="bg-red-500 h-full rounded-full transition-all duration-1000"
        :style="{ width: `${currentSoCPercentage}%` }"
      ></div>
    </div>
    <div class="flex justify-between text-black text-xs mt-1">
      <span>0%</span>
      <span>100%</span>
    </div>
  </div>
</template>
