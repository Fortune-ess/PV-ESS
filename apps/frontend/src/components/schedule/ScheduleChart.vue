<script setup lang="ts">
import { chartData, chartOptions } from '@/utils/StaticSchedule'
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
import { onMounted, ref, shallowRef } from 'vue'
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
const chartDataValue = shallowRef<ChartData<'bar' | 'line'>>({
  labels: [],
  datasets: [],
})

onMounted(async () => {
  try {
    isLoading.value = true
    chartDataValue.value = await chartData.get()
    isLoading.value = false
  } catch (error) {
    console.error('Failed to initialize chart data:', error)
    isLoading.value = false
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
