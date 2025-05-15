import { ChartData, ChartOptions } from 'chart.js'
import { ref } from 'vue'
import { useScheduleApi } from '@/api/scheduleApi'
import { timeLabels, chargeTimeMap, dischargeTimeMap, chargeCoefficientMap } from '@/config/timeMaps'

const scheduleData = useScheduleApi()
const chartDataRef = ref<ChartData<'bar' | 'line'> | null>(null)
let lastProcessedResult: ChartData<'bar' | 'line'> | null = null
let currentDataIndex = ref(0)
let updateInterval: NodeJS.Timeout | null = null
// Function to process data and create chart datasets
const processChartData = async (t: any): Promise<ChartData<'bar' | 'line'>> => {
  const response = await scheduleData.realTimeData('2023-09-30')
  const realTimeData = response.data[0].data

  // 初始化數據陣列
  const pvImmData: number[] = Array(96).fill(null)
  const pvDAData: number[] = Array(96).fill(null)
  const pvRawData: number[] = Array(96).fill(null)
  const socData: number[] = Array(96).fill(null)
  const dischargeData: number[] = Array(96).fill(null)
  // 只處理到當前索引的數據
  for (let i = 0; i <= currentDataIndex.value; i+=1) {
    const timePoint = realTimeData[i]
    if (timePoint) {
      pvImmData[i] = timePoint.PV_pImm || 0
      pvDAData[i] = timePoint.PV_pDA || 0
      pvRawData[i] = timePoint.PV_raw || 0
    }
  }
  const calculateSoc = () => {
    // 處理充電數據
    let totalChargeEnergy = 0
    for (let i = 0; i <= currentDataIndex.value; i+=1) {
      const timestamp = realTimeData[i]?.timestamp
      if (timestamp && chargeTimeMap[timestamp] !== undefined) {
        const index = chargeTimeMap[timestamp]
        const coefficient = chargeCoefficientMap[timestamp]
        const chargeEnergy = realTimeData[i]?.PV_raw * coefficient || 0
        socData[index] = chargeEnergy
        totalChargeEnergy += chargeEnergy
      }
    }

    // 處理放電數據
    const dischargeStartTime = '2023-09-30T14:30:00+08:00'
    let hasReachedDischargeTime = false

    // 檢查是否已到達放電時間
    for (let i = 0; i <= currentDataIndex.value; i+=1) {
      if (realTimeData[i].timestamp >= dischargeStartTime) {
        hasReachedDischargeTime = true
        break
      }
    }

    // 只有當到達放電時間才顯示放電數據
    if (hasReachedDischargeTime) {
      const currentTime = realTimeData[currentDataIndex.value]?.timestamp
      if (currentTime) {
        for (const [timestamp, { index, weight }] of Object.entries(dischargeTimeMap)) {
          if (currentTime >= timestamp) {
            const dischargeEnergy = totalChargeEnergy * weight
            dischargeData[index] = dischargeEnergy
          }
        }
      }
    }

    return { socData, dischargeData }
  }

  const { socData: updatedSocData, dischargeData: updatedDischargeData } = calculateSoc()
  Object.assign(socData, updatedSocData)
  Object.assign(dischargeData, updatedDischargeData)

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
        data: socData,
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
        data: dischargeData,
        yAxisID: 'y',
        barPercentage: 0.85,
        categoryPercentage: 0.92,
        stack: 'stack0',
        order: 3,
        pointStyle: 'rect',
      },
    ],
  }

  lastProcessedResult = newChartData
  return newChartData
}

export const chartData = {
  async get(t: any): Promise<ChartData<'bar' | 'line'>> {
    if (!chartDataRef.value) {
      chartDataRef.value = await processChartData(t)
    }
    return chartDataRef.value
  },
  async update(t: any): Promise<ChartData<'bar' | 'line'>> {
    chartDataRef.value = await processChartData(t)
    return chartDataRef.value
  },
  startAutoUpdate(t: any) {
    // 清除現有的定時器
    if (updateInterval) {
      clearInterval(updateInterval)
    }

    // 重置索引
    currentDataIndex.value = 0

    // 設置新的定時器
    updateInterval = setInterval(async () => {
      if (currentDataIndex.value < 95) { // 96個數據點，索引從0到95
        currentDataIndex.value+=1
        await chartData.update(t)
      } else {
        // 當到達最後一個數據點時，重置所有數據並重新開始
        currentDataIndex.value = 0
        chartDataRef.value = null
        lastProcessedResult = null
        await chartData.update(t)
      }
    }, 1000) // 每秒更新一次
  },
  stopAutoUpdate() {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  },
  reset() {
    currentDataIndex.value = 0
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  },
}

export const getChartOptions = (t: any): ChartOptions<'bar'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#2c3e50',
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: 18,
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      title: {
        display: true,
        text: t('main.dashboard.real_time_chart.title'),
        color: '#2c3e50',
        font: {
          size: 18,
          weight: 'bold',
          family: '\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
        },
        padding: {
          top: 12,
          bottom: 22,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2c3e50',
        bodyColor: '#34495e',
        borderColor: '#ecf0f1',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        cornerRadius: 6,
        titleFont: {
          weight: 'bold',
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y.toFixed(2)} kW`
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: true,
          color: 'rgba(189, 195, 199, 0.2)',
        },
        ticks: {
          color: '#7f8c8d',
          maxRotation: 90,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 96, // 96個時間點
          font: {
            size: 10,
            family: '\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
          },
          padding: 8,
        },
        border: {
          display: true,
          color: '#ecf0f1',
          width: 1,
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(189, 195, 199, 0.2)',
        },
        ticks: {
          color: '#7f8c8d',
          font: {
            size: 11,
            family: '\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
          },
          padding: 8,
          callback: function (value) {
            return `${value} kW`
          },
        },
        border: {
          display: true,
          color: '#ecf0f1',
          width: 1,
        },
        title: {
          display: true,
          text: t('main.dashboard.real_time_chart.power'),
          color: '#34495e',
          font: {
            size: 13,
            weight: 'bold',
            family: '\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
          },
          padding: {
            top: 0,
            bottom: 12,
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    animation: {
      duration: 150,
      easing: 'easeOutQuart',
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 6,
        hoverRadius: 6,
        hoverBorderWidth: 2,
      },
      line: {
        borderWidth: 2,
        tension: 0.4,
      },
      bar: {
        borderWidth: 1,
        borderRadius: 2,
      },
    },
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  }
}
