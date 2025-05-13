<script setup lang="ts">
import { chartData, getChartOptions } from '@/utils/ScheduleChart'
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

onMounted(async () => {
  try {
    isLoading.value = true
    chartDataValue.value = await chartData.get(t)
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
    const interval = setInterval(updateData, 1000)
    
    // 在組件卸載時清理
    onUnmounted(() => {
      clearInterval(interval)
      chartData.stopAutoUpdate()
    })
  } catch (error) {
    console.error('Failed to initialize chart data:', error)
    isLoading.value = false
  }
})
</script>

<template>
  <div class="w-full h-full">
    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <div class="text-lg text-gray-500">Loading...</div>
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
