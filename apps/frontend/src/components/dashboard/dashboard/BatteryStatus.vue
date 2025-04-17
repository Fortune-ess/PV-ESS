<script setup lang="ts">
import { useDataStore } from '@/store/data'
import { chartData } from '@/utils/DoughnutChart'
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const dataStore = useDataStore()
const constants = dataStore.constants

// 從 DoughnutChart.ts 中獲取 SOC 值
const currentSoCValue = ref(0)
const currentSoCPercentage = ref(0)
const MAX_SOC = 11.5 // 與 DoughnutChart.ts 中的值保持一致
const TARGET_SOC = 8.19 // 與 DoughnutChart.ts 中的值保持一致

// 更新 SOC 值的函數
const updateSoCValue = async () => {
  try {
    // 獲取圖表數據
    const doughnutData = await chartData.get(t)
    
    // 從圖表數據中提取 SOC 值
    if (doughnutData && doughnutData.datasets.length > 0) {
      // 從數據集中獲取百分比值
      const percentage = doughnutData.datasets[0].data[0]
      // 計算實際的 SOC 值
      currentSoCValue.value = (percentage / 100) * MAX_SOC
      // 設置百分比值 - 使用 TARGET_SOC 作為 100% 的基準
      currentSoCPercentage.value = Math.min(Math.round((currentSoCValue.value / TARGET_SOC) * 100), 100)
    }
  } catch (error) {
    console.error('Error updating SOC value:', error)
  }
}

// 電池充電模擬計時器
let batteryChargingTimer: number | undefined

onMounted(async () => {
  // 初始更新 SOC 值
  await updateSoCValue()
  
  // 每秒更新一次 SOC 值
  batteryChargingTimer = window.setInterval(async () => {
    await updateSoCValue()
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
