<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { ref, watch } from 'vue'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  title: string
  label: string
  maxY: number
  reportType: 'monthly' | 'quarterly' | 'yearly'
}>()

const getLabels = () => {
  switch (props.reportType) {
    case 'monthly':
      return Array.from({ length: 30 }, (_, i) => (i + 1).toString())
    case 'quarterly':
      return Array.from({ length: 4 }, (_, i) => (i + 1).toString())
    case 'yearly':
      return Array.from({ length: 12 }, (_, i) => (i + 1).toString())
    default:
      return Array.from({ length: 30 }, (_, i) => (i + 1).toString())
  }
}

const getDataLength = () => {
  switch (props.reportType) {
    case 'monthly':
      return 30
    case 'quarterly':
      return 4
    case 'yearly':
      return 12
    default:
      return 30
  }
}

const generateChartData = () => ({
  labels: getLabels(),
  datasets: [
    {
      label: props.label,
      data: Array.from({ length: getDataLength() }, () =>
        Math.floor(Math.random() * props.maxY),
      ),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
})

const chartData = ref(generateChartData())

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, labels: { color: '#000000' } },
    title: {
      display: true,
      text: props.title,
      color: '#000000',
    },
  },
  scales: {
    x: { ticks: { color: '#000000' } },
    y: {
      beginAtZero: true,
      max: props.maxY,
      title: { display: true, text: props.label, color: '#000000' },
      ticks: { color: '#000000' },
    },
  },
}

// 監聽 `reportType` 變化
watch(
  () => props.reportType,
  () => {
    chartData.value = generateChartData()
  },
)
</script>

<template>
  <div class="flex flex-col h-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
