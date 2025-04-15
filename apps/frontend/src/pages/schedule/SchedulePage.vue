<script setup lang="ts">
import ScheduleChart from '@/components/schedule/ScheduleChart.vue'
import Scrollform from '@/components/schedule/Scrollform.vue'
import { ref } from 'vue'

// 使用 ref 來儲存選擇的日期
const selectedDate = ref<string>('')

// 使用 ref 來儲存每個時段的功率值
const powerValues = ref<{ [key: string]: number }>({})

// 使用 ref 來儲存原始功率值
const originalPowerValues = ref<{ [key: string]: number }>({})

// 生成時間段
const times: string[] = []
for (let hour = 0; hour < 24; hour += 1) {
  for (let minute = 0; minute < 60; minute += 15) {
    const endMinute =
      minute + 15 >= 60 ? '00' : String(minute + 15).padStart(2, '0')
    const endHour =
      minute + 15 >= 60
        ? String(hour + 1).padStart(2, '0')
        : String(hour).padStart(2, '0')
    const timeKey = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} -> ${endHour}:${endMinute}`
    times.push(timeKey)
    powerValues.value[timeKey] = 0 // 為每個時段設定預設值0
    originalPowerValues.value[timeKey] = 0 // 同時設定原始值
  }
}

// 處理日期變更事件
const handleDateChange = (date: string) => {
  selectedDate.value = date
  console.log('選擇的日期:', selectedDate.value)


  // 重置原始功率值
  Object.keys(powerValues.value).forEach((key) => {
    originalPowerValues.value[key] = powerValues.value[key]
  })
}

// 儲存排程後更新原始值
const updateOriginalValues = () => {
  Object.keys(powerValues.value).forEach((key) => {
    originalPowerValues.value[key] = powerValues.value[key]
  })
}

</script>

<template>
  <div class="flex flex-col h-full gap-5">
    <!-- 上半部 (固定大小) -->
    <div class="flex flex-col items-center bg-white rounded-2xl p-4">
      <h1 class="text-xl font-medium mb-4 text-black flex items-center">
        {{ $t('main.dashboard.factory_generation_amount') }}
      </h1>

      <!-- 限制 LineChart 的大小 -->
      <div class="w-full flex justify-center">
        <ScheduleChart />
      </div>
    </div>

    <!-- 下半部 (佔據剩餘高度) -->
    <Scrollform
      :selectedDate="selectedDate"
      :powerValues="powerValues"
      :originalPowerValues="originalPowerValues"
      :times="times"
      @date-change="handleDateChange"
      @update-original-values="updateOriginalValues"
    />
  </div>
</template>
