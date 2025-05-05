<script setup lang="ts">
import { chartData as doughnutChartData } from '@/utils/DoughnutChart'
import { chartData as realTimeChartData } from '@/utils/RealTimeChart'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 從 DoughnutChart.ts 中獲取 SOC 值
const currentSoCValue = ref(0)
const dischargeAmount = ref(0)
const MAX_SOC = 18.40 // 與 DoughnutChart.ts 中的值保持一致
const TARGET_SOC = 13.104 // 與 DoughnutChart.ts 中的值保持一致

// 放電時間點索引
const DISCHARGE_INDICES = [78, 79, 80, 81, 82, 83, 84] // 對應 19:30 到 21:00 的時間點

// 更新 SOC 值的函數
const updateSoCValue = async () => {
  try {
    // 獲取圖表數據
    const doughnutData = await doughnutChartData.get(t)
    const realTimeData = await realTimeChartData.get(t)
    
    // 從圖表數據中提取 SOC 值
    if (doughnutData && doughnutData.datasets.length > 0) {
      // 從數據集中獲取百分比值
      const percentage = doughnutData.datasets[0].data[0]
      // 計算實際的 SOC 值
      currentSoCValue.value = (Number(percentage) / 100) * MAX_SOC
    }

    // 從實時圖表數據中提取放電量
    if (realTimeData && realTimeData.datasets.length > 0) {
      // 找到放電數據集（discharge_amount）
      const dischargeDataset = realTimeData.datasets.find(dataset => 
        dataset.label === t('main.dashboard.real_time_chart.discharge_amount')
      )
      if (dischargeDataset && dischargeDataset.data) {
        const socData = dischargeDataset.data as number[]
        // 只計算放電時間點的數據，並除以1000
        dischargeAmount.value = DISCHARGE_INDICES.reduce((sum, index) => sum + (socData[index] || 0), 0) / 1000
      }
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
    value: (currentSoCValue.value - dischargeAmount.value).toFixed(2)
  },
  { 
    title: 'current_discharge_amount',
    value: dischargeAmount.value.toFixed(2)
  }
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
