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
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
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
// 使用 shallowRef 代替 ref，減少深度監聽
const chartDataValue = shallowRef<ChartData<'bar' | 'line'>>({
  labels: [],
  datasets: [],
})

const chartOptions = getChartOptions(t)

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

// 使用防抖動包裝更新函數，但減少延遲時間
const debouncedUpdateChartData = debounce(async () => {
  try {
    const newData = await chartData.update(t)
    if (newData && newData.datasets && newData.datasets.length > 0) {
      chartDataValue.value = newData
    }
  } catch (error) {
    console.error('Failed to update chart data:', error)
  }
}, 100) // 減少延遲時間

const updateChartData = () => {
  debouncedUpdateChartData()
}

let updateInterval: number | null = null

onMounted(async () => {
  try {
    isLoading.value = true
    const initialData = await chartData.get(t)
    if (initialData && initialData.datasets && initialData.datasets.length > 0) {
      chartDataValue.value = initialData
    }
    isLoading.value = false
    // 保持每秒更新一次
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

// 監聽數據變化
watch(chartDataValue, () => {
}, { deep: true })
</script>

<template>
  <div class="flex w-full h-96">
    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
    <div v-else-if="!chartDataValue.datasets.length" class="flex items-center justify-center h-full">
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
