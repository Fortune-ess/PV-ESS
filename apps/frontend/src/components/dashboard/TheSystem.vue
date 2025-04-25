<script setup lang="ts">
import { onMounted } from 'vue'
import { useSystemStore } from '../../store/systemStore'
import BatteryIcon from './icons/BatteryIcon.vue'
import SolarpanelIcon from './icons/SolarpanelIcon.vue'
import TowerIcon from './icons/TowerIcon.vue'
import AnimationEffects from './thesystem/AnimationEffects.vue'
import ConnectionLines from './thesystem/ConnectionLines.vue'
import SystemComponent from './thesystem/SystemComponent.vue'

const {
  frequency,
  solarPower,
  batteryPower,
  oldPVPower,
  status,
  solarStatus,
  batteryStatus,
  oldPVStatus,
  totalPower,
  updateTotalPower,
  startAnimation,
} = useSystemStore()

onMounted(() => {
  updateTotalPower()
  startAnimation()
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
