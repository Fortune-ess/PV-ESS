<script setup lang="ts">
import { fetchRealTimeData } from '@/services/fetch-realtime-data'
import { onMounted, onUnmounted, ref } from 'vue'
import { useSystemStore } from '../../store/systemStore'
import BatteryIcon from './icons/BatteryIcon.vue'
import SolarpanelIcon from './icons/SolarpanelIcon.vue'
import TowerIcon from './icons/TowerIcon.vue'
import AnimationEffects from './thesystem/AnimationEffects.vue'
import ConnectionLines from './thesystem/ConnectionLines.vue'
import SystemComponent from './thesystem/SystemComponent.vue'

let oldPVPower = ref(0)
let dataUpdateInterval = ref<number | null>(null)

const useRealTimeData = async () => {
  const data = await fetchRealTimeData()
  for (let i = 0; i < data.length; i++) {
    if(data[i].timestamp){
      oldPVPower.value = data[data.length - 1].PV_raw
    }
  }
  return oldPVPower.value
}

const {
  frequency,
  solarPower,
  batteryPower,
  status,
  solarStatus,
  batteryStatus,
  oldPVStatus,
  totalPower,
  startAnimation,
} = useSystemStore()

onMounted(() => {
  useRealTimeData()
  startAnimation()
  
  // 每秒更新一次 oldPVPower
  dataUpdateInterval.value = setInterval(async () => {
    await useRealTimeData()
  }, 1000) as unknown as number
})

onUnmounted(() => {
  // 清除定時器
  if (dataUpdateInterval.value) {
    clearInterval(dataUpdateInterval.value)
  }
})
</script>

<template>
  <div class="rounded-xl text-black flex justify-center items-center">
    <div class="grid grid-cols-2 gap-4 relative">
      <!-- 系統組件 -->
      <SystemComponent
        title="PV System"
        :status="oldPVStatus"
        :icon="SolarpanelIcon"
      >
        {{ $t('main.dashboard.generation_amount') }}: {{ oldPVPower }}kWp
      </SystemComponent>

      <SystemComponent title="Grid Output" :status="status" :icon="TowerIcon">
        {{ $t('main.dashboard.frequency') }}: {{ frequency }}Hz |
        {{ $t('main.dashboard.generation_amount') }}:
        {{ totalPower.toFixed(2) }}kW
      </SystemComponent>

      <SystemComponent
        title="New PV System"
        :status="solarStatus"
        :icon="SolarpanelIcon"
      >
        {{ $t('main.dashboard.generation_amount') }}: {{ solarPower }}kWp
      </SystemComponent>

      <SystemComponent
        title="Energy Storage System"
        :status="batteryStatus"
        :icon="BatteryIcon"
      >
        Power: {{ batteryPower }}kW
      </SystemComponent>

      <!-- 連接線 -->
      <ConnectionLines />

      <!-- 動畫效果 -->
      <AnimationEffects />
    </div>
  </div>
</template>
