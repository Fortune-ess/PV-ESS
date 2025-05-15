<script setup lang="ts">
import { useRealTimeDataStore } from '@/store/realTimeDataStore'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const realTimeStore = useRealTimeDataStore()

const today_accumulated_income = ref(0)
const this_month_accumulated_income = ref(0)
const today_electricity_value = ref(0)
const abandonLightValue = ref(0)
const pvRawData = ref(0)
const socData = ref(0)
const dischargeData = ref(0)
const outputToGrid = ref(0)
const isNewCycle = ref(true)

const processStatsData = () => {
  const currentChartData = realTimeStore.chartData
  if (!currentChartData || !currentChartData.datasets || currentChartData.datasets.length === 0) {
    pvRawData.value = 0
    socData.value = 0
    dischargeData.value = 0
    outputToGrid.value = 0
    today_electricity_value.value = 0
    return
  }
  const pvRawDataset = currentChartData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.pv_raw'))
  if (pvRawDataset && pvRawDataset.data) {
    const firstFewPoints = (pvRawDataset.data as any[]).slice(0, 5);
    const allZeroOrNull = firstFewPoints.every(point => !point || Number(point) === 0);
    const hasLaterData = (pvRawDataset.data as any[]).some((point, index) => index > 10 && point && Number(point) > 0);
    
    if (allZeroOrNull && hasLaterData && !isNewCycle.value) {
      today_accumulated_income.value = 0
      this_month_accumulated_income.value = 0
      today_electricity_value.value = 0
      isNewCycle.value = true;
    } else if (!allZeroOrNull) {
      isNewCycle.value = false;
    }
  }

  try {
    const pvRawDataset = currentChartData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.pv_raw'))
    const chargeDataset = currentChartData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.feed_in_battery'))
    const dischargeDataset = currentChartData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.discharge_amount'))

    if (pvRawDataset && chargeDataset && dischargeDataset) {
      // Get the current value based on currentDataIndex
      const getCurrentValue = (data: any[] | undefined, index: number): number => {
        if (!data || index < 0 || index >= data.length) {
          return 0;
        }
        return Number(data[index]) || 0;
      }

      const currentIdx = realTimeStore.currentDataIndex;

      // 從數據集中提取最新的值
      const rawPv = getCurrentValue(pvRawDataset.data as any[], currentIdx)
      const rawCharge = getCurrentValue(chargeDataset.data as any[], currentIdx)
      const rawDischarge = getCurrentValue(dischargeDataset.data as any[], currentIdx)

      pvRawData.value = rawPv * 0.25
      socData.value = rawCharge
      dischargeData.value = rawDischarge
      outputToGrid.value = rawPv * 0.25
      if (rawCharge > 0 && rawDischarge === 0) {
        outputToGrid.value = (rawPv - rawCharge) * 0.25
      } else if (rawDischarge > 0) {
        outputToGrid.value = (rawPv + rawDischarge) * 0.25
      }

      today_electricity_value.value += outputToGrid.value
      today_accumulated_income.value = today_electricity_value.value * 4 * 1.25 + today_electricity_value.value * 9.39
      this_month_accumulated_income.value = today_accumulated_income.value * 30
    } else {
        pvRawData.value = 0
        socData.value = 0
        dischargeData.value = 0
        outputToGrid.value = 0
        today_electricity_value.value = 0
    }
  } catch (error) {
    console.error('Error processing stats data in StatsCards:', error)
  }
}

onMounted(async () => {
  today_accumulated_income.value = 0
  this_month_accumulated_income.value = 0
  today_electricity_value.value = 0
  isNewCycle.value = true

  await realTimeStore.getChartData(t)
  processStatsData()
  realTimeStore.startAutoUpdate(t)
})

onUnmounted(() => {
  realTimeStore.stopAutoUpdate()
})

watch(
  () => realTimeStore.chartData,
  (newChartData) => {
    if (newChartData) {
      processStatsData()
    }
  },
  { deep: true }
)

watch(
  () => realTimeStore.currentDataIndex,
  (newIndex, oldIndex) => {
    if (oldIndex > 90 && newIndex === 0) {
      today_accumulated_income.value = 0
      this_month_accumulated_income.value = 0
      today_electricity_value.value = 0
    }
  }
)

const stats = computed(() => [
  { title: 'today_accumulated_income', value: today_accumulated_income.value.toFixed(2), unit: 'NT $' },
  {
    title: 'this_month_accumulated_income',
    value: this_month_accumulated_income.value.toFixed(2),
    unit: 'NT $',
  },
  { title: 'today_generation_degree', value: today_electricity_value.value.toFixed(2), unit: 'kWh' },
  { title: 'abandon_light', value: abandonLightValue.value.toFixed(2), unit: '%' },
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
        <template v-if="stat.title === 'today_accumulated_income' || stat.title === 'this_month_accumulated_income'">
          {{ stat.unit }} {{ stat.value }}
        </template>
        <template v-else>
          {{ stat.value }} {{ stat.unit }}
        </template>
      </div>
    </div>
  </div>
</template>
