<script setup lang="ts">
import { chartData, getChartOptions } from '@/utils/RealTimeChart'
import type { ChartData } from 'chart.js'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { Chart } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

ChartJS.register(
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip,
  Filler,
)

const isLoading = ref(true)
const chartDataValue = shallowRef<ChartData<'bar' | 'line'>>({
  labels: [],
  datasets: [],
})

const chartOptions = getChartOptions(t)
let updateInterval: number | null = null

// Register cleanup function before any async operations
onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }
  chartData.stopAutoUpdate()
})

onMounted(async () => {
  try {
    isLoading.value = true
    const initialData = await chartData.get(t)
    if (initialData && initialData.datasets && initialData.datasets.length > 0) {
      chartDataValue.value = initialData
    }
    isLoading.value = false
    
    // 開始自動更新
    chartData.startAutoUpdate(t)
    
    // 設置數據更新監聽
    const updateData = async () => {
      const newData = await chartData.update(t)
      if (newData && newData.datasets && newData.datasets.length > 0) {
        chartDataValue.value = { ...newData }
      }
    }
    
    // 每秒更新一次數據
    updateInterval = setInterval(updateData, 1000) as unknown as number
  } catch (error) {
    console.error('Failed to initialize chart data:', error)
    isLoading.value = false
  }
})
</script>

<template>
  <div class="flex w-full h-96">
    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      ></div>
    </div>
    <div
      v-else-if="!chartDataValue.datasets.length"
      class="flex items-center justify-center h-full"
    >
      <p class="text-gray-500">No data available</p>
    </div>
    <Chart
      v-else
      type="bar"
      :data="chartDataValue"
      :options="chartOptions"
      class="w-full h-full"
    />
  </div>
</template>
