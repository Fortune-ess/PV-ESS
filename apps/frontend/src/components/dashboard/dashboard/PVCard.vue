<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { chartData as realTimeChartData } from '@/utils/RealTimeChart'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 實時數據
const pvRawData = ref(0)
const socData = ref(0)
const outputToGrid = ref(0)

// 更新數據的函數
const updateData = async () => {
  try {
    const realTimeData = await realTimeChartData.get(t)
    
    // 找到相關數據集
    const pvRawDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.pv_raw'))
    const chargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.feed_in_battery'))
    const dischargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.discharge_amount'))

    if (pvRawDataset && chargeDataset && dischargeDataset) {
      // 獲取最新的值
      const getLatestValue = (data: any[]) => {
        for (let i = data.length - 1; i >= 0; i--) {
          const value = Number(data[i]) || 0
          if (value > 0) {
            return value
          }
        }
        return 0
      }

      // 更新 PV_raw 值
      pvRawData.value = getLatestValue(pvRawDataset.data)

      // 獲取最新的充電和放電值
      let lastChargeValue = getLatestValue(chargeDataset.data)
      const lastDischargeValue = getLatestValue(dischargeDataset.data)

      // 檢查是否已超過充電時間
      if ( lastDischargeValue>0 ) {
        lastChargeValue = 0
      }

      // 更新 SOC 值
      socData.value = lastChargeValue

      // 計算輸出到電網的電量
      if (lastChargeValue > 0) {
        // 充電時，輸出到電網的電量為 PV_raw - 充電量
        outputToGrid.value = Math.max(0, pvRawData.value - lastChargeValue)
      } else if (lastDischargeValue > 0) {
        // 放電時，輸出到電網的電量就是放電量
        outputToGrid.value = pvRawData.value + lastDischargeValue
      } else {
        // 非充放電時間
        outputToGrid.value = pvRawData.value
      }
    }
  } catch (error) {
    console.error('Error updating data:', error)
  }
}

// 定時器 ID
let updateInterval: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  // 初始更新數據
  await updateData()

  // 每秒更新一次數據
  updateInterval = setInterval(async () => {
    await updateData()
  }, 0)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

const stats = computed(() => [
  {
    title: 'current_pv_system_generation',
    value: pvRawData.value.toFixed(2),
  },
  {
    title: 'current_new_pv_system_generation',
    value: '0.00',
  },
  {
    title: 'current_ESS_power',
    value: socData.value.toFixed(2),
  },
  {
    title: 'output_to_grid_amount',
    value: outputToGrid.value.toFixed(2),
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
        {{ $t(`main.dashboard.pvcard.${stat.title}`) }}
      </div>
      <div class="font-bold text-base">{{ stat.value }} kWh</div>
    </div>
  </div>
</template>
