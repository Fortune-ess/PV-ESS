<script setup lang="ts">
import { fetchRealTimeData } from '@/services/fetch-realtime-data'
import { chartData } from '@/utils/DoughnutChart'
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const realTimeData = await fetchRealTimeData()

const socData: number[] = Array(96).fill(0) // 初始化為96個0，對應每15分鐘一個時間點

  const calculateSoc = () => {

    const timeToIndexMap: { [key: string]: number } = {
      '2023-09-30T09:00:00+08:00': 36, // 09:00 對應 timeLabels 中的索引
      '2023-09-30T09:15:00+08:00': 37,
      '2023-09-30T09:30:00+08:00': 38,
      '2023-09-30T09:45:00+08:00': 39,
      '2023-09-30T10:00:00+08:00': 40,
      '2023-09-30T10:15:00+08:00': 41,
      '2023-09-30T10:30:00+08:00': 42,
      '2023-09-30T10:45:00+08:00': 43,
      '2023-09-30T11:00:00+08:00': 44,
      '2023-09-30T11:15:00+08:00': 45,
      '2023-09-30T11:30:00+08:00': 46,
      '2023-09-30T11:45:00+08:00': 47,
      '2023-09-30T12:00:00+08:00': 48,
      '2023-09-30T12:15:00+08:00': 49,
      '2023-09-30T12:30:00+08:00': 50,
      '2023-09-30T12:45:00+08:00': 51,
      '2023-09-30T13:00:00+08:00': 52,
      '2023-09-30T13:15:00+08:00': 53,
      '2023-09-30T13:30:00+08:00': 54,
      '2023-09-30T13:45:00+08:00': 55,
      '2023-09-30T14:00:00+08:00': 56,
      '2023-09-30T14:15:00+08:00': 57
    };

    // 係數映射
    const coefficientMap: { [key: string]: number } = {
      '2023-09-30T09:00:00+08:00': 0.4,
      '2023-09-30T09:15:00+08:00': 0.81,
      '2023-09-30T09:30:00+08:00': 0.45,
      '2023-09-30T09:45:00+08:00': 0.41,
      '2023-09-30T10:00:00+08:00': 0.43,
      '2023-09-30T10:15:00+08:00': 0.64,
      '2023-09-30T10:30:00+08:00': 0.71,
      '2023-09-30T10:45:00+08:00': 0.54,
      '2023-09-30T11:00:00+08:00': 0.39,
      '2023-09-30T11:15:00+08:00': 0.36,
      '2023-09-30T11:30:00+08:00': 0.46,
      '2023-09-30T11:45:00+08:00': 0.49,
      '2023-09-30T12:00:00+08:00': 0.44,
      '2023-09-30T12:15:00+08:00': 0.45,
      '2023-09-30T12:30:00+08:00': 0.54,
      '2023-09-30T12:45:00+08:00': 0.97,
      '2023-09-30T13:00:00+08:00': 1.00,
      '2023-09-30T13:15:00+08:00': 0.76,
      '2023-09-30T13:30:00+08:00': 0.57,
      '2023-09-30T13:45:00+08:00': 0.55,
      '2023-09-30T14:00:00+08:00': 0.42,
      '2023-09-30T14:15:00+08:00': 0.34
    };

    for (let i = 0; i < realTimeData.length; i++) {
      const timestamp = realTimeData[i]?.timestamp;

      if (timestamp && timeToIndexMap[timestamp] !== undefined) {
        const index = timeToIndexMap[timestamp];
        const coefficient = coefficientMap[timestamp];

        if (i > 0) {
          socData[index] = (((realTimeData[i - 1]?.PV_raw + realTimeData[i]?.PV_raw) * 1 / 4) / 2) * coefficient || 0;
        } else {
          socData[index] = (realTimeData[i]?.PV_raw * 1 / 4) * coefficient || 0;
        }
      }
    }
    socData.reduce((acc, curr) => acc + curr, 0) / 1000
    return socData;
  }
  // 處理實時數據
  if (realTimeData && realTimeData.length > 0) {
    calculateSoc()
  }


// 從 DoughnutChart.ts 中獲取 SOC 值
const currentSoCValue = ref(0)
const currentSoCPercentage = ref(0)
const MAX_SOC = 11.5 // 與 DoughnutChart.ts 中的值保持一致
const TARGET_SOC = 8.19 // 與 DoughnutChart.ts 中的值保持一致

// 更新 SOC 值的函數
const updateSoCValue = async () => {
  try {
    // 獲取圖表數據
    const doughnutData = await chartData.get(t)
    
    // 從圖表數據中提取 SOC 值
    if (doughnutData && doughnutData.datasets.length > 0) {
      // 從數據集中獲取百分比值
      const percentage = doughnutData.datasets[0].data[0]
      // 計算實際的 SOC 值
      currentSoCValue.value = (percentage / 100) * MAX_SOC
      // 設置百分比值 - 使用 TARGET_SOC 作為 100% 的基準
      currentSoCPercentage.value = Math.min(Math.round((currentSoCValue.value / TARGET_SOC) * 100), 100)
    }
  } catch (error) {
    console.error('Error updating SOC value:', error)
  }
}

// 電池充電模擬計時器
let batteryChargingTimer: number | undefined

onMounted(async () => {
  // 初始更新 SOC 值
  await updateSoCValue()
  
  // 每秒更新一次 SOC 值
  batteryChargingTimer = window.setInterval(async () => {
    await updateSoCValue()
  }, 1000)
})

onUnmounted(() => {
  if (batteryChargingTimer) {
    clearInterval(batteryChargingTimer)
  }
})
</script>

<template>
  <div class="mb-4 bg-[#b8f719] rounded-lg p-2">
    <div
      class="flex flex-col sm:flex-row justify-between text-black text-sm mb-2"
    >
      <span class="mb-1 sm:mb-0">
        {{ $t('main.dashboard.total_energy') }}: {{ socData }}MWh
      </span>
      <span>
        {{ $t('main.dashboard.current_charge') }}: {{ currentSoCPercentage }}%
      </span>
    </div>
    <div class="w-full bg-gray-300/40 rounded-full h-2 overflow-hidden">
      <div
        class="bg-red-500 h-full rounded-full transition-all duration-1000"
        :style="{ width: `${currentSoCPercentage}%` }"
      ></div>
    </div>
    <div class="flex justify-between text-black text-xs mt-1">
      <span>0%</span>
      <span>100%</span>
    </div>
  </div>
</template>
