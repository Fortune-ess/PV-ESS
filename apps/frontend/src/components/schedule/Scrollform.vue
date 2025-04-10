<script setup lang="ts">
import axios from 'axios'
import Swal from 'sweetalert2'
import { computed, onMounted, ref } from 'vue'

// 接收從父組件傳入的屬性
const props = defineProps<{
  selectedDate: string
  powerValues: { [key: string]: number }
  originalPowerValues: { [key: string]: number }
  times: string[]
}>()

// 定義事件
const emit = defineEmits<{
  (e: 'date-change', date: string): void
  (e: 'update-original-values'): void
  (e: 'update:selectedDate', date: string): void
}>()

// 本地日期狀態
const localSelectedDate = ref(props.selectedDate)
// 當前時間
const currentTime = ref(new Date())

// 設置定時器更新當前時間
const updateCurrentTime = () => {
  currentTime.value = new Date()
}

// 在組件掛載時設置當前日期和啟動定時器
onMounted(() => {
  if (!props.selectedDate) {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`

    localSelectedDate.value = formattedDate
    emit('update:selectedDate', formattedDate)
    emit('date-change', formattedDate)
  }

  // 初始化當前時間
  updateCurrentTime()

  // 每分鐘更新一次當前時間
  setInterval(updateCurrentTime, 60000)
})

// 計算屬性：判斷是否已選擇日期
const isDateSelected = computed(() => !!props.selectedDate)

// 計算屬性：判斷排程是否有變動
const hasScheduleChanged = computed(() => {
  if (!isDateSelected.value) return false

  return Object.entries(props.powerValues).some(([timeSlot, power]) => {
    return power !== props.originalPowerValues[timeSlot]
  })
})

// 計算屬性：獲取已變更的時間段
const changedTimestamps = computed(() => {
  if (!isDateSelected.value) return []

  return Object.entries(props.powerValues)
    .filter(
      ([timeSlot, power]) => power !== props.originalPowerValues[timeSlot],
    )
    .map(([timeSlot]) => timeSlot)
})

// 判斷時間段是否已過期（不可編輯）
const isTimeSlotPast = (timeSlot: string) => {
  // 如果選擇的日期是過去的日期，則所有時間段都不可編輯
  const today = new Date()
  const selectedDate = new Date(props.selectedDate)

  // 重置時間部分以便只比較日期
  today.setHours(0, 0, 0, 0)
  selectedDate.setHours(0, 0, 0, 0)

  if (selectedDate < today) {
    return true
  }

  // 如果是當天，則檢查時間段是否已過
  if (selectedDate.getTime() === today.getTime()) {
    // 從時間段中提取開始時間（例如從 "00:00 -> 00:15" 提取 "00:00"）
    const startTime = timeSlot.split(' -> ')[0]
    const [hours, minutes] = startTime.split(':').map(Number)

    const timeSlotDate = new Date()
    timeSlotDate.setHours(hours, minutes, 0, 0)

    // 如果時間段的開始時間已經過去，則不可編輯
    return timeSlotDate <= currentTime.value
  }

  return false
}

// 處理日期變更事件
const handleDateChange = () => {
  emit('update:selectedDate', localSelectedDate.value)
  emit('date-change', localSelectedDate.value)
}

// 將時間段轉換為ISO格式的時間戳
const convertToISOTimestamp = (date: string, timeSlot: string) => {
  // 從時間段中提取小時和分鐘（例如從 "00:00 -> 00:15" 提取 "00:00"）
  const startTime = timeSlot.split(' -> ')[0]
  const [hours, minutes] = startTime.split(':').map(Number)

  // 創建日期對象
  const dateObj = new Date(date)
  dateObj.setHours(hours, minutes, 0, 0)

  // 返回ISO格式的時間戳
  return dateObj.toISOString()
}

// 儲存排程功能
const saveSchedule = async () => {
  if (!props.selectedDate) {
    alert('請先選擇日期')
    return
  }

  if (!hasScheduleChanged.value) {
    Swal.fire({
      title: '無變更',
      text: '排程未有任何變動',
      icon: 'info',
      confirmButtonColor: '#10b981',
    })
    return
  }

  // 獲取已變更的時間段
  const changedTimes = changedTimestamps.value

  // 創建JSON格式的數據
  const scheduleData = changedTimes.map((timestamp) => ({
    data: {
      timestamp: convertToISOTimestamp(props.selectedDate, timestamp),
      status: 0,
      esHSL: props.powerValues[timestamp] / 1000,
      pvEnergy: 0,
      esEnergy: 0,
      soc: 0,
    },
    _id: '',
    qseId: '33284077',
    groupId: 1,
    date: props.selectedDate,
    __v: 0,
  }))

  // 轉換為JSON字符串
  const jsonData = JSON.stringify(scheduleData, null, 2)

  // 使用 SweetAlert2 顯示確認對話框
  const result = await Swal.fire({
    title: '確認送出排程?',
    html: `
      <div class="text-left">
        <p><strong>日期:</strong> ${props.selectedDate}</p>
        <p><strong>功率設定:</strong></p>
        <div style="max-height: 200px; overflow-y: auto; margin-bottom: 10px;">
          <pre>${jsonData}</pre>
        </div>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '確認送出',
    cancelButtonText: '取消',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#ef4444',
  })

  if (result.isConfirmed) {
    try {
      // 將所有變更整合為一個請求
      const updateData = changedTimes.map((timestamp) => ({
        data: {
          timestamp: convertToISOTimestamp(props.selectedDate, timestamp),
          status: 0,
          esHSL: props.powerValues[timestamp] / 1000,
          pvEnergy: 0,
          esEnergy: 0,
          soc: 0,
        },
        _id: '',
        qseId: '33284077',
        groupId: 1,
        date: props.selectedDate,
        __v: 0,
      }))

      // 發送單一請求更新所有變更
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/schedule/${props.selectedDate}`,
        updateData,
      )

      console.log('儲存排程成功:', response)

      Swal.fire({
        title: '成功!',
        text: '排程已成功送出',
        icon: 'success',
        confirmButtonColor: '#10b981',
      })

      // 通知父組件更新原始功率值
      emit('update-original-values')
    } catch (error) {
      console.error('儲存排程失敗:', error)
      Swal.fire({
        title: '錯誤!',
        text: '排程送出失敗，請稍後再試',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  }
}
</script>

<template>
  <div
    class="flex flex-col md:flex-row gap-4 justify-between items-center mb-4 bg-emerald-900/80 rounded-2xl p-4"
  >
    <div class="relative">
      <input
        type="date"
        v-model="localSelectedDate"
        @change="handleDateChange"
        class="bg-emerald-100 border border-emerald-300 rounded-md px-4 py-2 w-64 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
      />
      <CalendarIcon
        class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-700 pointer-events-none"
      />
    </div>
    <h1 class="text-emerald-100">
      {{ isDateSelected ? '' : '請選擇日期' }}
    </h1>

    <button
      class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md flex items-center transition-all shadow-lg shadow-emerald-500/20"
      @click="saveSchedule"
      :disabled="!isDateSelected || !hasScheduleChanged"
      :class="{
        'opacity-50 cursor-not-allowed': !isDateSelected || !hasScheduleChanged,
      }"
    >
      Save Schedule
    </button>
  </div>
  <div class="flex flex-col lg:flex-row gap-8 h-[calc(100vh-12rem)]">
    <!-- 左邊表格 -->
    <div
      class="flex-1 rounded-2xl bg-emerald-900/80 backdrop-blur-sm border border-emerald-600/30 overflow-hidden"
    >
      <div
        class="max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-emerald-900/50"
      >
        <table class="w-full text-emerald-50">
          <thead class="sticky top-0 z-10">
            <tr>
              <th class="bg-emerald-950/90 p-3 text-center backdrop-blur-sm">
                Schedule Time
              </th>
              <th class="bg-emerald-950/90 p-3 text-center backdrop-blur-sm">
                Schedule Power (kW)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="time in times"
              :key="time"
              class="hover:bg-emerald-800/40 transition-colors"
              :class="{ 'opacity-70': isTimeSlotPast(time) }"
            >
              <td class="p-2 text-center border-b border-emerald-600/30">
                {{ time }}
                <span
                  v-if="isTimeSlotPast(time)"
                  class="text-xs text-amber-400 ml-2"
                  >(Expired)</span
                >
              </td>
              <td class="p-2 border-b border-emerald-600/30">
                <div class="flex items-center gap-4">
                  <input
                    type="range"
                    v-model="powerValues[time]"
                    min="0"
                    max="4000"
                    step="1"
                    class="w-full h-2 bg-emerald-800/70 rounded-lg appearance-none cursor-pointer hover:bg-emerald-700/70 transition-all"
                    :disabled="!isDateSelected || isTimeSlotPast(time)"
                    :class="{
                      'opacity-50 cursor-not-allowed':
                        !isDateSelected || isTimeSlotPast(time),
                    }"
                  />
                  <span class="min-w-[4rem] text-right"
                    >{{ powerValues[time] }} kW</span
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
