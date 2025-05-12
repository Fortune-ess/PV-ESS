<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { chartData as realTimeChartData } from '@/utils/RealTimeChart'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 從 RealTimeChart 中獲取數據
const currentSoCValue = ref(0)
const dischargeAmount = ref(0)

// 更新 SOC 值的函數
const updateSoCValue = async () => {
  try {
    const realTimeData = await realTimeChartData.get(t)
    
    // 找到充電和放電數據集
    const chargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.feed_in_battery'))
    const dischargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.discharge_amount'))

    if (chargeDataset && dischargeDataset) {
      // 計算總充電量
      const totalCharge = chargeDataset.data.reduce((sum: number, value: any) => {
        const numValue = Number(value) || 0
        return sum + numValue
      }, 0)
      
      // 計算總放電量
      const totalDischarge = dischargeDataset.data.reduce((sum: number, value: any) => {
        const numValue = Number(value) || 0
        return sum + numValue
      }, 0)

      // 更新 SOC 值和放電量
      currentSoCValue.value = Math.max(0, totalCharge - totalDischarge) / 1000
      dischargeAmount.value = totalDischarge / 1000
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
    value: currentSoCValue.value.toFixed(2),
  },
  {
    title: 'current_discharge_amount',
    value: dischargeAmount.value.toFixed(2),
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
      <div class="font-bold text-base">{{ stat.value }} MWh</div>
    </div>
  </div>
</template>
