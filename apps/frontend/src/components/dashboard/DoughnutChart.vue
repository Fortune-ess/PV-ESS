<script setup lang="ts">
import { chartData, chartOptions } from '@/utils/DoughnutChart'
import { ChartData, ChartOptions } from 'chart.js'
import { onMounted, ref, watch } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 圖表數據和選項
const doughnutData = ref<ChartData<'doughnut'> | null>(null)
const doughnutOptions = ref<ChartOptions<'doughnut'> | null>(null)
const socValue = ref(0)
const socPercentage = ref(0)
const isTargetReached = ref(false)

// 目標值和最大 SOC 值
const TARGET_SOC = 13.104
const MAX_SOC = 18.40

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
        :class="isTargetReached ? 'bg-green-500' : 'bg-orange-500'"
      >
        <span class="mr-1">{{ isTargetReached ? '✓' : '⟳' }}</span>
        <span>{{ isTargetReached ? 'Charged' : 'Charging' }}</span>
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

<style scoped>
/* 移除所有 scoped styles，因為我們現在使用 Tailwind */
</style>
