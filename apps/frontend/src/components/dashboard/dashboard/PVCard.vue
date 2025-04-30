<script setup lang="ts">
import { chartData as doughnutChartData } from '@/utils/DoughnutChart'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 從 DoughnutChart.ts 中獲取 SOC 值
const currentSoCValue = ref(0)
const MAX_SOC = 18.40 // 與 DoughnutChart.ts 中的值保持一致
const TARGET_SOC = 13.104 // 與 DoughnutChart.ts 中的值保持一致

// 更新 SOC 值的函數
const updateSoCValue = async () => {
  try {
    // 獲取圖表數據
    const chartData = await doughnutChartData.get(t)
    
    // 從圖表數據中提取 SOC 值
    if (chartData && chartData.datasets.length > 0) {
      // 從數據集中獲取百分比值
      const percentage = chartData.datasets[0].data[0]
      // 計算實際的 SOC 值
      currentSoCValue.value = (Number(percentage) / 100) * MAX_SOC
    }
  } catch (error) {
    console.error('Error updating SOC value:', error)
  }
}

// 定時器 ID
let updateInterval: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  // 初始更新 SOC 值
  await updateSoCValue()
  
  // 每秒更新一次 SOC 值
  updateInterval = setInterval(async () => {
    await updateSoCValue()
  }, 1000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

const stats = computed(() => [
  { 
    title: 'current_soc_total_charge',
    value: currentSoCValue.value.toFixed(2)
  },
  { 
    title: 'current_remaining_charge',
    value: Math.max(0, (TARGET_SOC - currentSoCValue.value)).toFixed(2)
  },
  { 
    title: 'total_charge_amount',
    value: TARGET_SOC.toFixed(2)
  },
  { 
    title: 'output_to_grid_amount',
    value: Math.max(0, (currentSoCValue.value - TARGET_SOC)).toFixed(2)
  },
])
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div
      v-for="stat in stats"
      :key="stat.title"
      class="text-black backdrop-blur-[30px] rounded-xl bg-white/70 shadow-2xl shadow-white/90 flex flex-col justify-center p-4"
    >
      <div class="text-xs text-gray-500">
        {{ $t(`main.dashboard.${stat.title}`) }}
      </div>
      <div class="font-bold text-base">
        {{ stat.value }} MWh
      </div>
    </div>
  </div>
</template>
