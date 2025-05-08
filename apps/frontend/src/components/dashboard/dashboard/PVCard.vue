<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useSystemStore } from '@/store/systemStore'
import { fetchRealTimeData } from '@/services/fetch-realtime-data'

const systemStore = useSystemStore()

// 實時數據
const pvRawData = ref(0)
const socData = ref(0)

// 更新數據的函數
const updateData = async () => {
  try {
    // 獲取實時數據
    const realTimeData = await fetchRealTimeData()
    if (realTimeData && realTimeData.length > 0) {
      // 檢查是否到達指定時間點
      const lastTimestamp = realTimeData[realTimeData.length - 1]?.timestamp
      if (lastTimestamp === '2023-09-30T17:45:00+08:00') {
        // 當到達指定時間點時歸零
        pvRawData.value = 0
        socData.value = 0
      } else {
        // 獲取最新的 PV_raw 值
        pvRawData.value = realTimeData[realTimeData.length - 1]?.PV_raw || 0

        // 獲取最新的 socData 值
        const latestSocValue = systemStore.batteryPower.value
        socData.value = latestSocValue
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
  }, 1000)
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
    value: Math.max(0, pvRawData.value - socData.value).toFixed(2),
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
