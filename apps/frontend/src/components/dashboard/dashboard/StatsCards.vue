<script setup lang="ts">
import { chartData as realTimeChartData } from '@/utils/RealTimeChart'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const today_accumulated_income = ref(0)
const this_month_accumulated_income = ref(0)
const today_electricity_value = ref(0)
const abandonLightValue = ref(0)
let updateInterval: ReturnType<typeof setInterval> | null = null
let lastProcessedData = ref<any>(null)

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
      today_electricity_value.value = pvRawData.value

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
        today_accumulated_income.value = today_accumulated_income.value + outputToGrid.value * 9.39
        
      } else if (lastDischargeValue > 0) {
        // 放電時，輸出到電網的電量就是放電量
        outputToGrid.value = pvRawData.value + lastDischargeValue
        today_accumulated_income.value = today_accumulated_income.value + outputToGrid.value * 9.39
      } else {
        // 非充放電時間
        outputToGrid.value = pvRawData.value
        today_accumulated_income.value = today_accumulated_income.value + outputToGrid.value * 9.39
      }
      this_month_accumulated_income.value = today_accumulated_income.value * 30
    }
  } catch (error) {
    console.error('Error updating data:', error)
  }
}

onMounted(() => {
  // 初始化時重置數據
  today_accumulated_income.value = 0
  this_month_accumulated_income.value = 0
  today_electricity_value.value = 0
  lastProcessedData.value = null

  // Initial update
  updateData()

  // 每秒更新一次
  updateInterval = setInterval(updateData, 1000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

const stats = computed(() => [
  { title: 'today_accumulated_income', value: today_accumulated_income.value.toFixed(2), unit: 'TWD' },
  {
    title: 'this_month_accumulated_income',
    value: this_month_accumulated_income.value.toFixed(2),
    unit: 'TWD',
  },
  { title: 'today_generation_degree', value: today_electricity_value.value.toFixed(2), unit: 'kWh' },
  { title: 'abandon_light', value: abandonLightValue.value, unit: '%' },
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
        {{ stat.value }} {{ stat.unit }}
      </div>
    </div>
  </div>
</template>
