<script setup lang="ts">
import { chartData, chartOptions } from '@/utils/BarScheduleChart'
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
import { onMounted, onUnmounted, ref } from 'vue'
import { Chart } from 'vue-chartjs'

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
const chartDataValue = ref<ChartData<'bar' | 'line'>>({
  labels: [],
  datasets: [],
})

// 防抖動函數
const debounce = (fn: Function, delay: number) => {
  let timer: number | null = null
  return function(this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 使用防抖動包裝更新函數
const debouncedUpdateChartData = debounce(async () => {
  try {
    chartDataValue.value = await chartData.update()
  } catch (error) {
    console.error('Failed to update chart data:', error)
  }
}, 300)

const updateChartData = () => {
  debouncedUpdateChartData()
}

let updateInterval: number | null = null

onMounted(async () => {
  try {
    isLoading.value = true
    chartDataValue.value = await chartData.get()
    isLoading.value = false
    // 將更新頻率從1秒改為5秒
    updateInterval = window.setInterval(updateChartData, 1000)
  } catch (error) {
    console.error('Failed to initialize chart data:', error)
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (updateInterval !== null) {
    clearInterval(updateInterval)
    updateInterval = null
  }
})
</script>

<template>
  <div class="w-full h-96">
    <div v-if="isLoading" class="flex items-center justify-center h-full">
      loading...
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
