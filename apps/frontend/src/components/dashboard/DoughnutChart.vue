<script setup lang="ts">
import { chartData, chartOptions } from '@/utils/DoughnutChart'
import { ChartData, ChartOptions } from 'chart.js'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'
import {
  MAX_SOC,
  TARGET_SOC,
} from '@/config/timeMaps'
import { chartData as realTimeChartData } from '@/utils/RealTimeChart'

const { t } = useI18n()

// 圖表數據和選項
const doughnutData = ref<ChartData<'doughnut'> | null>(null)
const doughnutOptions = ref<ChartOptions<'doughnut'> | null>(null)
const socValue = ref(0)
const socPercentage = ref(0)
const isTargetReached = ref(false)
const isDischarging = ref(false)
const isCharging = ref(false)

// 獲取最新的非零值
const getLatestNonZeroValue = (data: any[]): number => {
  for (let i = data.length - 1; i >= 0; i--) {
    const value = Number(data[i]) || 0
    if (value > 0) {
      return value
    }
  }
  return 0
}

// 初始化圖表
onMounted(async () => {
  try {
    // 獲取圖表數據
    doughnutData.value = await chartData.get(t)

    // 從圖表數據中提取 SOC 值
    if (doughnutData.value && doughnutData.value.datasets.length > 0) {
      // 從數據集中獲取百分比值
      const percentage = doughnutData.value.datasets[0].data[0]
      // 計算實際的 SOC 值
      socValue.value = (percentage / 100) * MAX_SOC

      // 計算 SOC 百分比
      socPercentage.value = Math.min(
        Math.round((socValue.value / MAX_SOC) * 100),
        100,
      )

      // 從 RealTimeChart 獲取數據來判斷狀態
      const realTimeData = await realTimeChartData.get(t)
      const chargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.feed_in_battery'))
      const dischargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.discharge_amount'))

      if (chargeDataset && dischargeDataset) {
        const lastChargeValue = getLatestNonZeroValue(chargeDataset.data)
        const lastDischargeValue = getLatestNonZeroValue(dischargeDataset.data)

        // 判斷充電和放電狀態
        isCharging.value = lastChargeValue > 0 && lastDischargeValue === 0
        isDischarging.value = lastDischargeValue > 0
        
        // 只有在沒有充電和放電時才判斷是否達到目標
        isTargetReached.value = !isCharging.value && !isDischarging.value && socValue.value >= TARGET_SOC
      }
    }

    // 創建圖表選項
    doughnutOptions.value = chartOptions(socValue.value)

    // 開始自動更新
    chartData.startAutoUpdate(t)

    // 設置定期更新圖表
    const updateInterval = setInterval(updateChart, 1000)
    
    // 在組件卸載時清理
    onUnmounted(() => {
      clearInterval(updateInterval)
      chartData.stopAutoUpdate()
    })
  } catch (error) {
    console.error('Error initializing doughnut chart:', error)
  }
})

// 監聽 SOC 值變化
watch(socValue, (newValue) => {
  // 計算 SOC 百分比
  socPercentage.value = Math.min(Math.round((newValue / MAX_SOC) * 100), 100)
  // 只有在沒有充電和放電時才更新目標狀態
  if (!isCharging.value && !isDischarging.value) {
  isTargetReached.value = newValue >= TARGET_SOC
  }
  if (doughnutOptions.value) {
    doughnutOptions.value = chartOptions(newValue)
  }
})

// 定期更新圖表數據
const updateChart = async () => {
  try {
    // 更新圖表數據
    doughnutData.value = await chartData.update(t)

    // 從圖表數據中提取 SOC 值
    if (doughnutData.value && doughnutData.value.datasets.length > 0) {
      // 從數據集中獲取百分比值
      const percentage = doughnutData.value.datasets[0].data[0]
      // 計算實際的 SOC 值
      socValue.value = (percentage / 100) * MAX_SOC

      // 計算 SOC 百分比
      socPercentage.value = Math.min(
        Math.round((socValue.value / MAX_SOC) * 100),
        100,
      )

      // 從 RealTimeChart 獲取數據來判斷狀態
      const realTimeData = await realTimeChartData.get(t)
      const chargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.feed_in_battery'))
      const dischargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.discharge_amount'))

      if (chargeDataset && dischargeDataset) {
        const lastChargeValue = getLatestNonZeroValue(chargeDataset.data)
        const lastDischargeValue = getLatestNonZeroValue(dischargeDataset.data)

        // 判斷充電和放電狀態
        isCharging.value = lastChargeValue > 0 && lastDischargeValue === 0
        isDischarging.value = lastDischargeValue > 0
        
        // 只有在沒有充電和放電時才判斷是否達到目標
        isTargetReached.value = !isCharging.value && !isDischarging.value && socValue.value >= TARGET_SOC
      }
    }
  } catch (error) {
    console.error('Error updating doughnut chart:', error)
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center p-4">
    <!-- 添加標題 -->
    <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">
      {{ t('main.dashboard.doughnut_chart.title') }}
    </h3>

    <div class="relative w-full h-[80%] flex items-center justify-center">
      <Doughnut
        v-if="doughnutData && doughnutOptions"
        :data="doughnutData"
        :options="doughnutOptions"
      />
      <div
        v-else
        class="flex items-center justify-center h-full text-lg text-gray-600"
      >
        Loading...
      </div>

      <!-- 目標標記 -->
      <div
        class="absolute top-1/2 left-0 flex items-center px-2 py-1 rounded text-sm font-bold text-white shadow-sm"
        :class="
          isDischarging
              ? 'bg-red-500'
              : isCharging
                ? 'bg-amber-500'
              : isTargetReached
                ? 'bg-green-500'
                : 'bg-gray-500'
        "
      >
        <span class="mr-1">{{
          isDischarging ? '↓' : isCharging ? '↑' : isTargetReached ? '✓' : '⟳'
        }}</span>
        <span>{{
          isDischarging
              ? 'Discharging'
              : isCharging
                ? 'Charging'
              : isTargetReached
                ? 'Charged'
                : 'Idle'
        }}</span>
      </div>
    </div>

    <!-- 當前 SOC 值顯示 -->
    <div class="mt-2.5 flex flex-wrap items-center text-sm text-gray-600">
      <span class="mr-1">Current SOC:</span>
      <span class="font-bold text-blue-500">{{ socValue.toFixed(2) }} MWh</span>
      <span class="ml-1 text-gray-500">({{ socPercentage }}%)</span>
    </div>
  </div>
</template>
