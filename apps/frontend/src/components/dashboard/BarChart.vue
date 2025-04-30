<script setup lang="ts">
import { chartData } from '@/utils/DoughnutChart'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartData,
} from 'chart.js'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const currentCharge = ref(0) // 當前充電百分比
let chargeInterval: ReturnType<typeof setInterval> | null = null // 用於存儲定時器ID

// 從 DoughnutChart.ts 中獲取 SOC 值
const currentSoCValue = ref(0)
const MAX_SOC = 18.40 // 與 DoughnutChart.ts 中的值保持一致
const TARGET_SOC = 13.104 // 與 DoughnutChart.ts 中的值保持一致

// 更新 SOC 值的函數
const updateSoCValue = async () => {
  try {
    // 獲取圖表數據
    const doughnutData = await chartData.update(t)
    
    // 從圖表數據中提取 SOC 值
    if (doughnutData && doughnutData.datasets.length > 0) {
      // 從數據集中獲取百分比值
      const percentage = doughnutData.datasets[0].data[0]
      // 計算實際的 SOC 值
      currentSoCValue.value = (percentage / 100) * MAX_SOC
      // 設置百分比值 - 使用 TARGET_SOC 作為 100% 的基準
      currentCharge.value = Math.min(Math.round((currentSoCValue.value / TARGET_SOC) * 100), 100)
    }
  } catch (error) {
    console.error('Error updating SOC value:', error)
  }
}

// 獲取SOC數據並處理
onMounted(async () => {
  // 初始更新 SOC 值
  await updateSoCValue()
  
  // 每1秒更新一次 SOC 值，與 DoughnutChart 保持同步
  chargeInterval = setInterval(async () => {
    await updateSoCValue()
  }, 1000)
})

// 在組件卸載時清除定時器
onUnmounted(() => {
  if (chargeInterval) {
    clearInterval(chargeInterval)
  }
})

// 修改 batteryConfigs，只保留前4個配置
const batteryConfigs = [
  { initialOffset: 0, maxValue: 100 },
  { initialOffset: 0, maxValue: 100 },
  { initialOffset: 0, maxValue: 100 },
  { initialOffset: 0, maxValue: 100 },
]

// 計算每組的充電量，移除波動效果
const chargedData = computed(() => {
  return batteryConfigs.map((config) => {
    // 為每個柱子添加輕微的時間差和最大值差異
    const adjustedCharge = Math.min(
      currentCharge.value + config.initialOffset,
      config.maxValue,
    )

    return Number(
      Math.max(0, Math.min(100, adjustedCharge)).toFixed(1),
    )
  })
})

const remainingData = computed(() => {
  return chargedData.value.map((charged) => {
    // 計算剩餘可充電量（100% - 已充電百分比）
    return Number((100 - charged).toFixed(1))
  })
})

// 修改圖表數據
const data = computed<ChartData<'bar'>>(() => ({
  // 保持所有 labels，但只顯示前4個的數據
  labels: ['SOC1', 'SOC2', 'SOC3', 'SOC4', 'SOC5', 'SOC6'],
  datasets: [
    {
      label: t('main.dashboard.bar_chart.charged'),
      // 只使用前4個數據，後面補 null
      data: [...chargedData.value.slice(0, 4), null, null],
      backgroundColor: '#eb9234',
      borderWidth: 0,
      barPercentage: 0.7,
    },
    {
      label: t('main.dashboard.bar_chart.remaining'),
      // 只使用前4個數據，後面補 null
      data: [...remainingData.value.slice(0, 4), null, null],
      backgroundColor: '#37eb34',
      borderWidth: 1,
      barPercentage: 0.7,
    },
  ],
}))

const option = {
  responsive: true,
  maintainAspectRatio: false,
  width: 600,
  height: 400,
  plugins: {
    title: {
      display: true,
      text: t('main.dashboard.bar_chart.title'),
      color: '#000000',
      font: {
        size: 18,
        color: '#000000',
      },
    },
    legend: {
      labels: {
        color: '#000000',
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#000000',
      },
    },
    y: {
      beginAtZero: true,
      stacked: true,
      min: 0,
      max: 100,
      title: {
        display: true,
        text: t('main.dashboard.bar_chart.capacity'),
        color: '#000000',
      },
      ticks: {
        color: '#000000',
      },
    },
  },
  // 添加性能優化選項
  animation: {
    duration: 1000, // 減少動畫時間
  },
}
</script>

<template>
  <Bar :data="data" :options="option" />
</template>
