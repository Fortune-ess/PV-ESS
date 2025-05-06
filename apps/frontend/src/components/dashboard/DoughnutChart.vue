<script setup lang="ts">
import { chartData, chartOptions } from '@/utils/DoughnutChart'
import { ChartData, ChartOptions } from 'chart.js'
import { onMounted, ref, watch } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'
import { fetchRealTimeData } from '@/services/fetch-realtime-data'

const { t } = useI18n()

// 圖表數據和選項
const doughnutData = ref<ChartData<'doughnut'> | null>(null)
const doughnutOptions = ref<ChartOptions<'doughnut'> | null>(null)
const socValue = ref(0)
const socPercentage = ref(0)
const isTargetReached = ref(false)
const isDischarging = ref(false)
const isCharging = ref(false)

// 目標值和最大 SOC 值
const TARGET_SOC = 13.104
const MAX_SOC = 18.40

// 充電時間映射
const chargingTimeMap: { [key: string]: number } = {
  '2023-09-30T09:00:00+08:00': 36,
  '2023-09-30T09:15:00+08:00': 37,
  '2023-09-30T09:30:00+08:00': 38,
  '2023-09-30T09:45:00+08:00': 39,
  '2023-09-30T10:00:00+08:00': 40,
  '2023-09-30T10:15:00+08:00': 41,
  '2023-09-30T10:30:00+08:00': 42,
  '2023-09-30T10:45:00+08:00': 43,
  '2023-09-30T11:00:00+08:00': 44,
  '2023-09-30T11:15:00+08:00': 45,
  '2023-09-30T11:30:00+08:00': 46,
  '2023-09-30T11:45:00+08:00': 47,
  '2023-09-30T12:00:00+08:00': 48,
  '2023-09-30T12:15:00+08:00': 49,
  '2023-09-30T12:30:00+08:00': 50,
  '2023-09-30T12:45:00+08:00': 51,
  '2023-09-30T13:00:00+08:00': 52,
  '2023-09-30T13:15:00+08:00': 53,
  '2023-09-30T13:30:00+08:00': 54,
  '2023-09-30T13:45:00+08:00': 55,
  '2023-09-30T14:00:00+08:00': 56,
  '2023-09-30T14:15:00+08:00': 57,
}

// 放電時間映射
const dischargeTimeMap: { [key: string]: { index: number; weight: number } } = {
  '2023-09-30T19:30:00+08:00': { index: 78, weight: 0.1 },  // 10%
  '2023-09-30T19:45:00+08:00': { index: 79, weight: 0.15 }, // 15%
  '2023-09-30T20:00:00+08:00': { index: 80, weight: 0.2 },  // 20%
  '2023-09-30T20:15:00+08:00': { index: 81, weight: 0.2 },  // 20%
  '2023-09-30T20:30:00+08:00': { index: 82, weight: 0.15 }, // 15%
  '2023-09-30T20:45:00+08:00': { index: 83, weight: 0.1 },  // 10%
  '2023-09-30T21:00:00+08:00': { index: 84, weight: 0.1 },  // 10%
}

// 檢查當前狀態
const checkStatus = (currentTime: string) => {
  // 檢查是否在充電時間範圍內
  if (chargingTimeMap[currentTime]) {
    return 'charging'
  }
  // 檢查是否在放電時間範圍內
  if (dischargeTimeMap[currentTime]) {
    return 'discharging'
  }
  // 其他時間為閒置
  return 'idle'
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
      socPercentage.value = Math.min(Math.round((socValue.value / MAX_SOC) * 100), 100)
      isTargetReached.value = socValue.value >= TARGET_SOC
      
      // 獲取實時數據
      const realTimeData = await fetchRealTimeData()
      const currentTime = realTimeData[realTimeData.length - 1]?.timestamp
      if (currentTime) {
        const status = checkStatus(currentTime)
        
        // 設置狀態
        isCharging.value = status === 'charging'
        isDischarging.value = status === 'discharging'
      }
    }
    
    // 創建圖表選項
    doughnutOptions.value = chartOptions(socValue.value)
  } catch (error) {
    console.error('Error initializing doughnut chart:', error)
  }
})

// 監聽 SOC 值變化
watch(socValue, (newValue) => {
  // 計算 SOC 百分比
  socPercentage.value = Math.min(Math.round((newValue / MAX_SOC) * 100), 100)
  isTargetReached.value = newValue >= TARGET_SOC
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
      socPercentage.value = Math.min(Math.round((socValue.value / MAX_SOC) * 100), 100)
      isTargetReached.value = socValue.value >= TARGET_SOC
      
      // 獲取實時數據
      const realTimeData = await fetchRealTimeData()
      const currentTime = realTimeData[realTimeData.length - 1]?.timestamp
      if (currentTime) {
        const status = checkStatus(currentTime)
        
        // 設置狀態
        isCharging.value = status === 'charging'
        isDischarging.value = status === 'discharging'
      }
    }
  } catch (error) {
    console.error('Error updating doughnut chart:', error)
  }
}

// 每秒更新一次圖表
setInterval(updateChart, 1000)
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center p-4">
    <!-- 添加標題 -->
    <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">
      {{ t('main.dashboard.doughnut_chart.title') }}
    </h3>
    
    <div class="relative w-full h-[80%] flex items-center justify-center">
      <Doughnut v-if="doughnutData && doughnutOptions" :data="doughnutData" :options="doughnutOptions" />
      <div v-else class="flex items-center justify-center h-full text-lg text-gray-600">
        Loading...
      </div>
      
      <!-- 目標標記 -->
      <div 
        class="absolute top-1/2 left-0 flex items-center px-2 py-1 rounded text-sm font-bold text-white shadow-sm"
        :class="isTargetReached ? 'bg-green-500' : isDischarging ? 'bg-red-500' : isCharging ? 'bg-amber-500' : 'bg-gray-500'"
      >
        <span class="mr-1">{{ isTargetReached ? '✓' : isDischarging ? '↓' : isCharging ? '↑' : '⟳' }}</span>
        <span>{{ isTargetReached ? 'Charged' : isDischarging ? 'Discharging' : isCharging ? 'Charging' : 'Idle' }}</span>
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
