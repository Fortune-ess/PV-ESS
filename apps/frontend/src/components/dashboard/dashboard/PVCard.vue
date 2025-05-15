<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRealTimeDataStore } from '@/store/realTimeDataStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const realTimeStore = useRealTimeDataStore()

const pvRawData = ref(0)
const socData = ref(0)
const dischargeData = ref(0)
const outputToGrid = ref(0)
const isCharging = ref(true)

const processLocalStats = () => {
  const currentChartData = realTimeStore.chartData
  if (!currentChartData || !currentChartData.datasets || currentChartData.datasets.length === 0) {
    pvRawData.value = 0
    socData.value = 0
    dischargeData.value = 0
    outputToGrid.value = 0
    isCharging.value = true
   return
  }

  try {
    const pvRawDataset = currentChartData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.pv_raw'))
    const chargeDataset = currentChartData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.feed_in_battery'))
    const dischargeDataset = currentChartData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.discharge_amount'))

    if (pvRawDataset && chargeDataset && dischargeDataset) {
      const getCurrentValue = (data: any[] | undefined | null, index: number): number => {
        if (!data || index < 0 || index >= data.length) {
          return 0;
        }
        return Number(data[index]) || 0;
      }

      const currentIdx = realTimeStore.currentDataIndex;

      const rawPv = getCurrentValue(pvRawDataset.data as any[], currentIdx)
      const rawCharge = getCurrentValue(chargeDataset.data as any[], currentIdx)
      const rawDischarge = getCurrentValue(dischargeDataset.data as any[], currentIdx)
  
      pvRawData.value = rawPv * 0.25
      socData.value = rawCharge
      dischargeData.value = rawDischarge
      outputToGrid.value = rawPv * 0.25
      
      isCharging.value = rawDischarge === 0 || rawCharge > rawDischarge
      
      if (rawCharge > 0 && rawDischarge === 0) {
        outputToGrid.value = (rawPv - rawCharge) * 0.25
      } else if (rawDischarge > 0) {
        outputToGrid.value = (rawPv + rawDischarge) * 0.25
      }
    } else {
      pvRawData.value = 0
      socData.value = 0
      dischargeData.value = 0
      outputToGrid.value = 0
      isCharging.value = true
    }
  } catch (error) {
    console.error('Error processing local stats in PVCard:', error)
  }
}

onMounted(async () => {
  await realTimeStore.getChartData(t)
  processLocalStats()
  realTimeStore.startAutoUpdate(t)
})

onUnmounted(() => {
  realTimeStore.stopAutoUpdate()
})

watch(
  () => realTimeStore.chartData,
  (newChartData) => {
    if (newChartData) {
      processLocalStats()
    }
  },
  { deep: true }
)

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
    value: isCharging.value 
      ? `${socData.value.toFixed(2)}` 
      : `${dischargeData.value.toFixed(2)}`,
    icon: isCharging.value ? '↓' : '↑',
    iconColor: isCharging.value ? 'text-green-500' : 'text-red-500',
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
      <div class="font-bold text-base flex items-center">
        <template v-if="stat.title === 'current_ESS_power'">
          <span :class="stat.iconColor" class="mr-1 text-lg">{{ stat.icon }}</span>
          {{ stat.value }}
          <span class="ml-1">kW</span>
        </template>
        <template v-else>
          {{ stat.value }} kWh
        </template>
      </div>
    </div>
  </div>
</template>