<script setup lang="ts">
import { chartData, chartOptions } from '@/utils/BarScheduleChart'
import type { ChartData } from 'chart.js'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
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
)

const isLoading = ref(true)
const chartDataValue = ref<ChartData<'bar' | 'line'>>({
  labels: [],
  datasets: [],
})

const updateChartData = async () => {
  try {
    chartDataValue.value = await chartData.update()
  } catch (error) {
    console.error('Failed to update chart data:', error)
  }
}

let updateInterval: number | null = null

onMounted(async () => {
  try {
    isLoading.value = true
    chartDataValue.value = await chartData.get()
    isLoading.value = false
    updateInterval = window.setInterval(updateChartData, 1000)
  } catch (error) {
    console.error('Failed to initialize chart data:', error)
    isLoading.value = false
  }
})

// 在組件卸載時清除定時器
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
