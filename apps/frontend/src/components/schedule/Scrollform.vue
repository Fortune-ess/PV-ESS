<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { timesMap } from '@/config/timeMaps'
import { chartData } from '@/utils/ScheduleChart'
import { useI18n } from 'vue-i18n'
import staticData from '@/assets/data.json' // Import data.json

// 定義時間段
const times = ref(timesMap)

// PV 發電量數據
const pvPower = ref<{ [key: string]: number }>({})
// Feed-In-Battery 數據
const feedInBattery = ref<{ [key: string]: number }>({})
// Discharge Amount 數據
const dischargeAmount = ref<{ [key: string]: number }>({})
// PV Power 和 DayAhead Prediction 的誤差值
const errorPercentage = ref<{ [key: string]: number }>({})

// Create a map for DayAheadPrediction data from staticData
const dayAheadPredictionMap: { [key: string]: number } = {}
staticData.forEach(item => {
  dayAheadPredictionMap[item.data.timestamp] = item.data.pvEnergy * 1000
})

// 問題在於時間格式不匹配，需要將時間段轉換為與數據中的timestamp格式相匹配
const timeMap: { [key: string]: string } = {}
times.value.forEach((time, index) => {
  // 從時間段中提取開始時間
  const startTime = time.split(' -> ')[0]
  const [hour, minute] = startTime.split(':')

  // 構建與數據中相同格式的時間戳 (2023-09-30T00:00:00+08:00)
  const formattedTime = `2023-09-30T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00+08:00`
  timeMap[time] = formattedTime
})

const { t } = useI18n()

// 更新數據的函數
const updateData = async () => {
  const realTimeData = await chartData.get(t)
  const pvRawDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.pv_raw'))
  const feedInBatteryDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.feed_in_battery'))
  const dischargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.discharge_amount'))
  
  if (pvRawDataset?.data) {
    // 將數據映射到對應的時間段
    times.value.forEach((time, index) => {
      const pvValue = pvRawDataset.data[index]
      pvPower.value[time] = typeof pvValue === 'number' ? pvValue : 0
      
      // 更新 Feed-In-Battery 數據
      const feedInValue = feedInBatteryDataset?.data[index]
      feedInBattery.value[time] = typeof feedInValue === 'number' ? feedInValue : 0
      
      // 更新 Discharge Amount 數據
      const dischargeValue = dischargeDataset?.data[index]
      dischargeAmount.value[time] = typeof dischargeValue === 'number' ? dischargeValue : 0
      
      // 計算 PV Power 和 DayAhead Prediction 的誤差值
      const formattedTimestamp = timeMap[time] // Get the formatted timestamp
      const dayAheadValue = dayAheadPredictionMap[formattedTimestamp] // Get pvEnergy from the map

      if (typeof pvValue === 'number' && typeof dayAheadValue === 'number' && dayAheadValue !== 0) {
        const error = ((pvValue - dayAheadValue) / dayAheadValue) * 100
        errorPercentage.value[time] = error
      } else {
        errorPercentage.value[time] = 0
      }
    })
  }
}

// 監聽圖表數據更新
let updateInterval: NodeJS.Timeout | null = null

const startAutoUpdate = () => {
  // 清除現有的定時器
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  
  // 立即更新一次
  updateData()
  
  // 設置定時器，每秒更新一次
  updateInterval = setInterval(() => {
    updateData()
  }, 1000)
}

// 組件掛載時開始自動更新
onMounted(() => {
  startAutoUpdate()
  chartData.startAutoUpdate(t)
})

// 組件卸載時停止自動更新
onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }
  chartData.stopAutoUpdate()
})
</script>

<template>
  <div class="flex flex-col p-2 md:p-4 h-96">
    <div
      class="rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full"
    >
      <div class="grid grid-cols-5 w-full text-gray-700 h-full">
        <!-- Header -->
        <div class="sticky top-0 z-10 col-span-5 grid grid-cols-5">
          <div
            class="bg-gradient-to-r from-cyan-500 to-cyan-600 p-2 md:p-4 text-center text-white font-medium text-xs md:text-sm uppercase tracking-wider"
          >
            Schedule Time
          </div>
          <div
            class="bg-gradient-to-r from-cyan-500 to-cyan-600 p-2 md:p-4 text-center text-white font-medium text-xs md:text-sm uppercase tracking-wider"
          >
            PV Power (kW)
          </div>
          <div
            class="bg-gradient-to-r from-cyan-500 to-cyan-600 p-2 md:p-4 text-center text-white font-medium text-xs md:text-sm uppercase tracking-wider"
          >
            Feed-In-Battery (kW)
          </div>
          <div
            class="bg-gradient-to-r from-cyan-500 to-cyan-600 p-2 md:p-4 text-center text-white font-medium text-xs md:text-sm uppercase tracking-wider"
          >
            Discharge Amount (kW)
          </div>
          <div
            class="bg-gradient-to-r from-cyan-500 to-cyan-600 p-2 md:p-4 text-center text-white font-medium text-xs md:text-sm uppercase tracking-wider"
          >
            Error (%)
          </div>
        </div>

        <!-- Content -->
        <div
          class="col-span-5 grid grid-cols-5 w-full overflow-y-auto max-h-screen"
        >
          <div v-for="time in times" :key="time" class="contents">
            <div
              class="p-2 md:p-4 text-center border-b border-gray-100 text-gray-600 font-medium text-xs md:text-sm even:bg-gray-50"
            >
              {{ time }}
            </div>
            <div
              class="p-2 md:p-4 text-center border-b border-gray-100 even:bg-gray-50"
            >
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs md:text-sm font-medium bg-cyan-100 text-cyan-800"
              >
                {{ pvPower[time]?.toFixed(2) || '0.00' }} kW
              </span>
            </div>
            <div
              class="p-2 md:p-4 text-center border-b border-gray-100 even:bg-gray-50"
            >
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs md:text-sm font-medium bg-green-100 text-green-800"
              >
                {{ feedInBattery[time]?.toFixed(2) || '0.00' }} kW
              </span>
            </div>
            <div
              class="p-2 md:p-4 text-center border-b border-gray-100 even:bg-gray-50"
            >
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs md:text-sm font-medium bg-blue-100 text-blue-800"
              >
                {{ dischargeAmount[time]?.toFixed(2) || '0.00' }} kW
              </span>
            </div>
            <div
              class="p-2 md:p-4 text-center border-b border-gray-100 even:bg-gray-50"
            >
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs md:text-sm font-medium"
                :class="errorPercentage[time] > 0 ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'"
              >
                {{ errorPercentage[time]?.toFixed(2) || '0.00' }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
