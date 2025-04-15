<script setup lang="ts">
import { useDataStore } from '@/store/data'
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

const dataStore = useDataStore()
const socData = ref<number[]>([])
const currentCharge = ref(0) // 當前充電百分比
const maxCharge = 100 // 最大充電百分比
let chargeInterval: ReturnType<typeof setInterval> | null = null // 用於存儲定時器ID
const animationSpeed = ref(0.5) // 控制動畫速度

// 獲取SOC數據並處理
onMounted(() => {
  socData.value = dataStore.getSocData()
  startCharging()
})

// 在組件卸載時清除定時器
onUnmounted(() => {
  if (chargeInterval) {
    clearInterval(chargeInterval)
  }
})

// 使用緩動函數使充電動畫更加平滑
const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3)
}

// 開始充電動畫，使用緩動函數實現平滑過渡
const startCharging = () => {
  let progress = 0

  chargeInterval = setInterval(() => {
    progress += animationSpeed.value

    if (progress <= 100) {
      // 使用緩動函數計算當前充電值
      const easedProgress = easeOutCubic(progress / 100) * 100
      currentCharge.value = Number(easedProgress.toFixed(1))
    } else {
      // 完成一次充電循環後，重置並開始新一輪
      progress = 0
      currentCharge.value = 0
    }
  }, 50) // 更高的更新頻率使動畫更流暢
}

// 修改 batteryConfigs，只保留前4個配置
const batteryConfigs = [
  { initialOffset: 5, maxValue: 100 },
  { initialOffset: 0, maxValue: 95 },
  { initialOffset: 10, maxValue: 100 },
  { initialOffset: 2, maxValue: 98 },
]

// 計算每組的充電量，添加一些隨機變化使動畫更自然
const chargedData = computed(() => {
  return batteryConfigs.map((config, index) => {
    // 為每個柱子添加輕微的時間差和最大值差異
    const adjustedCharge = Math.min(
      currentCharge.value + config.initialOffset,
      config.maxValue,
    )

    // 添加輕微的波動效果
    const fluctuation = Math.sin(Date.now() / 1000 + index) * 0.5

    return Number(
      Math.max(0, Math.min(100, adjustedCharge + fluctuation)).toFixed(1),
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
}
</script>

<template>
  <Bar :data="data" :options="option" />
</template>
