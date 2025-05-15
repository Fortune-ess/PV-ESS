import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChartData } from 'chart.js'
import { useScheduleApi } from '@/api/scheduleApi'
import { timeLabels, chargeTimeMap, dischargeTimeMap, chargeCoefficientMap } from '@/config/timeMaps'

export const useRealTimeDataStore = defineStore('realTimeData', () => {
  const scheduleDataApi = useScheduleApi()

  const chartData = ref<ChartData<'bar' | 'line'> | null>(null)
  const currentDataIndex = ref(0)
  let updateInterval: NodeJS.Timeout | null = null

  async function processChartData(t: any): Promise<ChartData<'bar' | 'line'>> {
    const response = await scheduleDataApi.realTimeData('2023-09-30')
    const realTimeApiData = response.data[0].data

    const pvImmData: (number | null)[] = Array(96).fill(null)
    const pvDAData: (number | null)[] = Array(96).fill(null)
    const pvRawData: (number | null)[] = Array(96).fill(null)
    const socDataArray: (number | null)[] = Array(96).fill(null)
    const dischargeDataArray: (number | null)[] = Array(96).fill(null) 

    for (let i = 0; i <= currentDataIndex.value && i < realTimeApiData.length; i += 1) {
      const timePoint = realTimeApiData[i]
      if (timePoint) {
        pvImmData[i] = timePoint.PV_pImm || 0
        pvDAData[i] = timePoint.PV_pDA || 0
        pvRawData[i] = timePoint.PV_raw || 0
      }
    }

    let totalChargeEnergy = 0
    for (let i = 0; i <= currentDataIndex.value && i < realTimeApiData.length; i += 1) {
      const timePoint = realTimeApiData[i]
      if (timePoint?.timestamp && chargeTimeMap[timePoint.timestamp] !== undefined) {
        const index = chargeTimeMap[timePoint.timestamp]
        const coefficient = chargeCoefficientMap[timePoint.timestamp]
        const chargeEnergy = timePoint.PV_raw * coefficient || 0
        socDataArray[index] = chargeEnergy
        totalChargeEnergy += chargeEnergy
      }
    }

    const dischargeStartTime = '2023-09-30T14:30:00+08:00'
    let hasReachedDischargeTime = false
    for (let i = 0; i <= currentDataIndex.value && i < realTimeApiData.length; i += 1) {
      if (realTimeApiData[i]?.timestamp >= dischargeStartTime) {
        hasReachedDischargeTime = true
        break
      }
    }

    if (hasReachedDischargeTime && currentDataIndex.value < realTimeApiData.length) {
      const currentTime = realTimeApiData[currentDataIndex.value]?.timestamp
      if (currentTime) {
        for (const [timestamp, { index, weight }] of Object.entries(dischargeTimeMap)) {
          if (currentTime >= timestamp) {
            const dischargeEnergy = totalChargeEnergy * weight
            dischargeDataArray[index] = dischargeEnergy
          }
        }
      }
    }
    
    const newChartData: ChartData<'bar' | 'line'> = {
      labels: timeLabels,
      datasets: [
        {
          label: t('main.dashboard.real_time_chart.pv_imm'),
          type: 'line',
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: false,
          data: pvImmData,
          yAxisID: 'y',
          pointStyle: 'line',
        },
        {
          label: t('main.dashboard.real_time_chart.feed_in_battery'),
          type: 'bar',
          backgroundColor: 'rgba(255, 87, 51)',
          borderColor: 'rgba(255, 87, 51, 0.9)',
          borderWidth: 1,
          data: socDataArray,
          yAxisID: 'y',
          barPercentage: 0.85,
          categoryPercentage: 0.92,
          stack: 'stack0',
          order: 2,
          pointStyle: 'rect',
        },
        {
          label: t('main.dashboard.real_time_chart.pv_raw'),
          type: 'line',
          backgroundColor: 'rgba(52, 152, 219, 0.3)',
          borderColor: 'rgba(52, 152, 219, 0.9)',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: false,
          data: pvRawData,
          yAxisID: 'y',
          pointStyle: 'line',
        },
        {
          label: t('main.dashboard.real_time_chart.discharge_amount'),
          type: 'bar',
          backgroundColor: 'rgba(161, 3, 252, 0.3)',
          borderColor: 'rgba(161, 3, 252, 0.9)',
          borderWidth: 1,
          data: dischargeDataArray,
          yAxisID: 'y',
          barPercentage: 0.85,
          categoryPercentage: 0.92,
          stack: 'stack0',
          order: 3,
          pointStyle: 'rect',
        },
      ],
    }
    chartData.value = newChartData
    return newChartData
  }

  async function getChartData(t: any): Promise<ChartData<'bar' | 'line'> | null> {
    if (!chartData.value) {
      await processChartData(t)
    }
    return chartData.value
  }

  async function updateChartData(t: any): Promise<ChartData<'bar' | 'line'> | null> {
    await processChartData(t)
    return chartData.value
  }

  function startAutoUpdate(t: any) {
    if (updateInterval) {
      clearInterval(updateInterval)
    }
    currentDataIndex.value = 0
    // chartData.value = null; // Reset chart data if needed on new start

    updateInterval = setInterval(async () => {
      // Assuming realTimeData in RealTimeChart.ts has 96 points (0-95)
      if (currentDataIndex.value < 95) { 
        currentDataIndex.value += 1
        await updateChartData(t)
      } else {
        currentDataIndex.value = 0
        // chartData.value = null; // Optionally reset before full loop restart
        await updateChartData(t) // Fetch data for the first point of the new cycle
      }
    }, 1000)
  }

  function stopAutoUpdate() {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }

  function resetStore() {
    currentDataIndex.value = 0
    chartData.value = null
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }

  return {
    chartData,
    currentDataIndex,
    getChartData,
    updateChartData,
    startAutoUpdate,
    stopAutoUpdate,
    resetStore,
    // remove processChartData from here if it's only internal
  }
}) 