<script setup lang="ts">
import { ref } from 'vue'
import data from '@/assets/data.json'

// 定義時間段
const times = ref([
  '00:00 -> 00:15',
  '00:15 -> 00:30',
  '00:30 -> 00:45',
  '00:45 -> 01:00',
  '01:00 -> 01:15',
  '01:15 -> 01:30',
  '01:30 -> 01:45',
  '01:45 -> 02:00',
  '02:00 -> 02:15',
  '02:15 -> 02:30',
  '02:30 -> 02:45',
  '02:45 -> 03:00',
  '03:00 -> 03:15',
  '03:15 -> 03:30',
  '03:30 -> 03:45',
  '03:45 -> 04:00',
  '04:00 -> 04:15',
  '04:15 -> 04:30',
  '04:30 -> 04:45',
  '04:45 -> 05:00',
  '05:00 -> 05:15',
  '05:15 -> 05:30',
  '05:30 -> 05:45',
  '05:45 -> 06:00',
  '06:00 -> 06:15',
  '06:15 -> 06:30',
  '06:30 -> 06:45',
  '06:45 -> 07:00',
  '07:00 -> 07:15',
  '07:15 -> 07:30',
  '07:30 -> 07:45',
  '07:45 -> 08:00',
  '08:00 -> 08:15',
  '08:15 -> 08:30',
  '08:30 -> 08:45',
  '08:45 -> 09:00',
  '09:00 -> 09:15',
  '09:15 -> 09:30',
  '09:30 -> 09:45',
  '09:45 -> 10:00',
  '10:00 -> 10:15',
  '10:15 -> 10:30',
  '10:30 -> 10:45',
  '10:45 -> 11:00',
  '11:00 -> 11:15',
  '11:15 -> 11:30',
  '11:30 -> 11:45',
  '11:45 -> 12:00',
  '12:00 -> 12:15',
  '12:15 -> 12:30',
  '12:30 -> 12:45',
  '12:45 -> 13:00',
  '13:00 -> 13:15',
  '13:15 -> 13:30',
  '13:30 -> 13:45',
  '13:45 -> 14:00',
  '14:00 -> 14:15',
  '14:15 -> 14:30',
  '14:30 -> 14:45',
  '14:45 -> 15:00',
  '15:00 -> 15:15',
  '15:15 -> 15:30',
  '15:30 -> 15:45',
  '15:45 -> 16:00',
  '16:00 -> 16:15',
  '16:15 -> 16:30',
  '16:30 -> 16:45',
  '16:45 -> 17:00',
  '17:00 -> 17:15',
  '17:15 -> 17:30',
  '17:30 -> 17:45',
  '17:45 -> 18:00',
  '18:00 -> 18:15',
  '18:15 -> 18:30',
  '18:30 -> 18:45',
  '18:45 -> 19:00',
  '19:00 -> 19:15',
  '19:15 -> 19:30',
  '19:30 -> 19:45',
  '19:45 -> 20:00',
  '20:00 -> 20:15',
  '20:15 -> 20:30',
  '20:30 -> 20:45',
  '20:45 -> 21:00',
  '21:00 -> 21:15',
  '21:15 -> 21:30',
  '21:30 -> 21:45',
  '21:45 -> 22:00',
  '22:00 -> 22:15',
  '22:15 -> 22:30',
  '22:30 -> 22:45',
  '22:45 -> 23:00',
  '23:00 -> 23:15',
  '23:15 -> 23:30',
  '23:30 -> 23:45',
  '23:45 -> 00:00',
])

// 模擬 PV 發電量數據
const pvPower = ref<{ [key: string]: number }>({})

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

// 填充pvPower數據
data.forEach((element) => {
  const timestamp = element.data.timestamp
  // 找到對應的時間段
  const timeKey = Object.keys(timeMap).find((key) => timeMap[key] === timestamp)
  if (timeKey) {
    pvPower.value[timeKey] = element.data.pvEnergy * 1000
  }
})

// 確保所有時間段都有值，沒有對應數據的設為0
times.value.forEach((time) => {
  if (pvPower.value[time] === undefined) {
    pvPower.value[time] = 0
  }
})
</script>

<template>
  <div class="flex flex-col p-2 md:p-4 h-96">
    <div
      class="rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full"
    >
      <div class="grid grid-cols-2 w-full text-gray-700 h-full">
        <!-- Header -->
        <div class="sticky top-0 z-10 col-span-2 grid grid-cols-2">
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
        </div>

        <!-- Content -->
        <div
          class="col-span-2 grid grid-cols-2 w-full overflow-y-auto max-h-screen"
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
                {{ pvPower[time] || 0 }} kW
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
