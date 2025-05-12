<script setup lang="ts">
import { chartData as doughnutChartData } from '@/utils/DoughnutChart'
import { chartData as realTimeChartData } from '@/utils/RealTimeChart'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  MAX_SOC,
  TARGET_SOC,
} from '@/config/timeMaps'

const { t } = useI18n()

// 從 DoughnutChart 中獲取 SOC 值
const currentSoCValue = ref(0)
const currentSoCPercentage = ref(0)
const isCharging = ref(false)
const isDischarging = ref(false)
const hasReachedTarget = ref(false)

// 確保百分比值有效
const safePercentage = computed(() => {
  return isNaN(currentSoCPercentage.value) ? 0 : currentSoCPercentage.value
})

// 確保總能量值有效，直接使用 DoughnutChart 的 SOC 值
const safeTotalSocValue = computed(() => {
  return isNaN(currentSoCValue.value) ? 0 : currentSoCValue.value
})

// 更新 SOC 值的函數
const updateSoCValue = async () => {
  try {
    // 獲取圖表數據
    const doughnutData = await doughnutChartData.update(t)
    const realTimeData = await realTimeChartData.get(t)

    // 從圖表數據中提取 SOC 值
    if (doughnutData && doughnutData.datasets.length > 0) {
      // 從數據集中獲取百分比值
      const percentage = doughnutData.datasets[0].data[0]
      
      // 更新 SOC 值（使用與 DoughnutChart 相同的計算方式）
      currentSoCValue.value = (percentage / 100) * MAX_SOC

      // 檢查是否達到目標
      hasReachedTarget.value = currentSoCValue.value >= TARGET_SOC

      // 更新百分比：使用 TARGET_SOC 作為 100% 的基準
      currentSoCPercentage.value = Math.min((currentSoCValue.value / TARGET_SOC) * 100, 100)

      // 從 RealTimeChart 獲取數據來判斷狀態
      const chargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.feed_in_battery'))
      const dischargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.discharge_amount'))

      if (chargeDataset && dischargeDataset) {
        const lastChargeValue = Number(chargeDataset.data[chargeDataset.data.length - 1]) || 0
        const lastDischargeValue = Number(dischargeDataset.data[dischargeDataset.data.length - 1]) || 0

        isCharging.value = lastChargeValue > 0
        isDischarging.value = lastDischargeValue > 0
      }
    }
  } catch (error) {
    console.error('Error updating SOC value:', error)
  }
}

// 電池充電模擬計時器
let batteryChargingTimer: number | undefined

onMounted(async () => {
  // 初始化數據
  await updateSoCValue()

  // 每秒更新一次 SOC 值
  batteryChargingTimer = window.setInterval(async () => {
    await updateSoCValue()
  }, 0)
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
        {{ $t('main.dashboard.total_energy') }}:
        {{ safeTotalSocValue.toFixed(2) }}MWh
      </span>
      <span>
        {{ $t('main.dashboard.current_charge') }}: {{ safePercentage.toFixed(0) }}%
      </span>
    </div>
    <div class="w-full bg-gray-300/40 rounded-full h-2 overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-1000"
        :class="{
          'bg-purple-500': isDischarging,
          'bg-blue-500': isCharging,
          'bg-green-500': hasReachedTarget,
          'bg-red-500': !isCharging && !isDischarging && !hasReachedTarget
        }"
        :style="{ width: `${safePercentage}%` }"
      ></div>
    </div>
    <div class="flex justify-between text-black text-xs mt-1">
      <span>0%</span>
      <span>100%</span>
    </div>
  </div>
</template>
