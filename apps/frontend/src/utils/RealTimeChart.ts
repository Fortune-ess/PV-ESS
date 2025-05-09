import { fetchRealTimeData } from '@/services/fetch-realtime-data'
import type { RealTimeData } from '@/types'
import { ChartData, ChartOptions } from 'chart.js'
import { ref } from 'vue'

// 時間標籤
const timeLabels = [
  '00:00',
  '00:15',
  '00:30',
  '00:45',
  '01:00',
  '01:15',
  '01:30',
  '01:45',
  '02:00',
  '02:15',
  '02:30',
  '02:45',
  '03:00',
  '03:15',
  '03:30',
  '03:45',
  '04:00',
  '04:15',
  '04:30',
  '04:45',
  '05:00',
  '05:15',
  '05:30',
  '05:45',
  '06:00',
  '06:15',
  '06:30',
  '06:45',
  '07:00',
  '07:15',
  '07:30',
  '07:45',
  '08:00',
  '08:15',
  '08:30',
  '08:45',
  '09:00',
  '09:15',
  '09:30',
  '09:45',
  '10:00',
  '10:15',
  '10:30',
  '10:45',
  '11:00',
  '11:15',
  '11:30',
  '11:45',
  '12:00',
  '12:15',
  '12:30',
  '12:45',
  '13:00',
  '13:15',
  '13:30',
  '13:45',
  '14:00',
  '14:15',
  '14:30',
  '14:45',
  '15:00',
  '15:15',
  '15:30',
  '15:45',
  '16:00',
  '16:15',
  '16:30',
  '16:45',
  '17:00',
  '17:15',
  '17:30',
  '17:45',
  '18:00',
  '18:15',
  '18:30',
  '18:45',
  '19:00',
  '19:15',
  '19:30',
  '19:45',
  '20:00',
  '20:15',
  '20:30',
  '20:45',
  '21:00',
  '21:15',
  '21:30',
  '21:45',
  '22:00',
  '22:15',
  '22:30',
  '22:45',
  '23:00',
  '23:15',
  '23:30',
  '23:45',
]

const chartDataRef = ref<ChartData<'bar' | 'line'> | null>(null)
let lastProcessedData: RealTimeData[] = []
let lastProcessedResult: ChartData<'bar' | 'line'> | null = null

// Function to process data and create chart datasets
const processChartData = async (t: any): Promise<ChartData<'bar' | 'line'>> => {
  const realTimeData = await fetchRealTimeData()

  if (
    realTimeData.length === lastProcessedData.length &&
    JSON.stringify(realTimeData) === JSON.stringify(lastProcessedData) &&
    lastProcessedResult
  ) {
    return lastProcessedResult
  }

  lastProcessedData = JSON.parse(JSON.stringify(realTimeData))

  // 初始化數據陣列
  const pvImmData: number[] = []
  const pvDAData: number[] = []
  const pvRawData: number[] = []
  const socData: number[] = Array(96).fill(0) // 初始化為96個0，對應每15分鐘一個時間點
  const dischargeData: number[] = Array(96).fill(0) // 新增放電數據數組

  const calculateSoc = () => {
    // 充電時間映射
    const chargeTimeMap: { [key: string]: number } = {
      '2023-09-30T09:00:00+08:00': 36,
      '2023-09-30T09:15:00+08:00': 37,
      '2023-09-30T09:30:00+08:00': 38,
      '2023-09-30T09:45:00+08:00': 39,
      '2023-09-30T10:00:00+08:00': 40,
      '2023-09-30T10:15:00+08:00': 41,
      '2023-09-30T10:30:00+08:00': 42,
      '2023-09-30T10:45:00+08:00': 43,
      '2023-09-30T11:00:00+08:00': 44,
      '2023-09-30T11:15:00+08:00': 45,
      '2023-09-30T11:30:00+08:00': 46,
      '2023-09-30T11:45:00+08:00': 47,
      '2023-09-30T12:00:00+08:00': 48,
      '2023-09-30T12:15:00+08:00': 49,
      '2023-09-30T12:30:00+08:00': 50,
      '2023-09-30T12:45:00+08:00': 51,
      '2023-09-30T13:00:00+08:00': 52,
      '2023-09-30T13:15:00+08:00': 53,
      '2023-09-30T13:30:00+08:00': 54,
      '2023-09-30T13:45:00+08:00': 55,
      '2023-09-30T14:00:00+08:00': 56,
      '2023-09-30T14:15:00+08:00': 57,
    }

    // 放電時間映射與權重
    const dischargeTimeMap: {
      [key: string]: { index: number; weight: number }
    } = {
      '2023-09-30T14:30:00+08:00': { index: 58, weight: 0.01 },
      '2023-09-30T14:45:00+08:00': { index: 59, weight: 0.015 },
      '2023-09-30T15:00:00+08:00': { index: 60, weight: 0.02 },
      '2023-09-30T15:15:00+08:00': { index: 61, weight: 0.025 },
      '2023-09-30T15:30:00+08:00': { index: 62, weight: 0.03 },
      '2023-09-30T15:45:00+08:00': { index: 63, weight: 0.035 },
      '2023-09-30T16:00:00+08:00': { index: 64, weight: 0.04 },
      '2023-09-30T16:15:00+08:00': { index: 65, weight: 0.042 },
      '2023-09-30T16:30:00+08:00': { index: 66, weight: 0.042 },
      '2023-09-30T16:45:00+08:00': { index: 67, weight: 0.042 },
      '2023-09-30T17:00:00+08:00': { index: 68, weight: 0.042 },
      '2023-09-30T17:15:00+08:00': { index: 69, weight: 0.042 },
      '2023-09-30T17:30:00+08:00': { index: 70, weight: 0.042 },
      '2023-09-30T17:45:00+08:00': { index: 71, weight: 0.042 },
      '2023-09-30T18:00:00+08:00': { index: 72, weight: 0.042 },
      '2023-09-30T18:15:00+08:00': { index: 73, weight: 0.042 },
      '2023-09-30T18:30:00+08:00': { index: 74, weight: 0.042 },
      '2023-09-30T18:45:00+08:00': { index: 75, weight: 0.042 },
      '2023-09-30T19:00:00+08:00': { index: 76, weight: 0.042 },
      '2023-09-30T19:15:00+08:00': { index: 77, weight: 0.042 },
      '2023-09-30T19:30:00+08:00': { index: 78, weight: 0.042 },
      '2023-09-30T19:45:00+08:00': { index: 79, weight: 0.042 },
      '2023-09-30T20:00:00+08:00': { index: 80, weight: 0.04 },
      '2023-09-30T20:15:00+08:00': { index: 81, weight: 0.035 },
      '2023-09-30T20:30:00+08:00': { index: 82, weight: 0.03 },
      '2023-09-30T20:45:00+08:00': { index: 83, weight: 0.025 },
      '2023-09-30T21:00:00+08:00': { index: 84, weight: 0.02 },
      '2023-09-30T21:15:00+08:00': { index: 85, weight: 0.015 },
      '2023-09-30T21:30:00+08:00': { index: 86, weight: 0.01 },
      '2023-09-30T21:45:00+08:00': { index: 87, weight: 0.005 },
      '2023-09-30T22:00:00+08:00': { index: 88, weight: 0.005 },
    }

    // 充電係數映射
    const chargeCoefficientMap: { [key: string]: number } = {
      '2023-09-30T09:00:00+08:00': 0.4,
      '2023-09-30T09:15:00+08:00': 0.81,
      '2023-09-30T09:30:00+08:00': 0.45,
      '2023-09-30T09:45:00+08:00': 0.41,
      '2023-09-30T10:00:00+08:00': 0.43,
      '2023-09-30T10:15:00+08:00': 0.64,
      '2023-09-30T10:30:00+08:00': 0.71,
      '2023-09-30T10:45:00+08:00': 0.54,
      '2023-09-30T11:00:00+08:00': 0.39,
      '2023-09-30T11:15:00+08:00': 0.36,
      '2023-09-30T11:30:00+08:00': 0.46,
      '2023-09-30T11:45:00+08:00': 0.49,
      '2023-09-30T12:00:00+08:00': 0.44,
      '2023-09-30T12:15:00+08:00': 0.45,
      '2023-09-30T12:30:00+08:00': 0.54,
      '2023-09-30T12:45:00+08:00': 0.97,
      '2023-09-30T13:00:00+08:00': 1.0,
      '2023-09-30T13:15:00+08:00': 0.76,
      '2023-09-30T13:30:00+08:00': 0.57,
      '2023-09-30T13:45:00+08:00': 0.55,
      '2023-09-30T14:00:00+08:00': 0.42,
      '2023-09-30T14:15:00+08:00': 0.34,
    }

    // 處理充電數據
    let totalChargeEnergy = 0 // 追蹤總充電量
    for (let i = 0; i < realTimeData.length; i += 1) {
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
    for (const data of realTimeData) {
      if (data.timestamp >= dischargeStartTime) {
        hasReachedDischargeTime = true
        break
      }
    }

    // 只有當到達放電時間才顯示放電數據
    if (hasReachedDischargeTime) {
      // 找出當前時間對應的放電時間點
      const currentTime = realTimeData[realTimeData.length - 1]?.timestamp
      if (currentTime) {
        for (const [timestamp, { index, weight }] of Object.entries(
          dischargeTimeMap,
        )) {
          // 如果當前時間已經到達或超過該放電時間點，就顯示該時間點的放電數據
          if (currentTime >= timestamp) {
            const dischargeEnergy = totalChargeEnergy * weight
            dischargeData[index] = dischargeEnergy // 使用新的放電數據數組
          }
        }
      }
    }

    return { socData, dischargeData }
  }

  // 處理實時數據
  if (realTimeData && realTimeData.length > 0) {
    for (let i = 0; i < realTimeData.length; i += 1) {
      pvImmData.push(realTimeData[i]?.PV_pImm || 0)
      pvDAData.push(realTimeData[i]?.PV_pDA || 0)
      pvRawData.push(realTimeData[i]?.PV_raw || 0)
    }
    const { socData: updatedSocData, dischargeData: updatedDischargeData } =
      calculateSoc()
    Object.assign(socData, updatedSocData)
    Object.assign(dischargeData, updatedDischargeData)
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

  // 緩存處理結果
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
