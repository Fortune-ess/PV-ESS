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
import { onMounted, ref } from 'vue'
import { Chart } from 'vue-chartjs'

// ✅ 註冊所有控制器，確保 Bar 和 Line 正常顯示
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

// 🔄 使用 ref 來存儲圖表數據
const isLoading = ref(true)
const chartDataValue = ref<ChartData<'bar' | 'line'>>({
  labels: [],
  datasets: [],
})

// 在組件掛載時獲取數據
onMounted(async () => {
  try {
    chartDataValue.value = await chartData.get()
  } catch (error) {
    console.error('加載圖表數據時出錯:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="w-full h-96">
    <div v-if="isLoading" class="flex items-center justify-center h-full">
      正在加載圖表數據...
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
