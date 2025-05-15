import data from '@/assets/data.json'
import { ChartData, ChartOptions } from 'chart.js'
import { ref } from 'vue'
import { timeLabels, chargeTimeMap, dischargeTimeMap, chargeCoefficientMap } from '@/config/timeMaps'
import { useScheduleApi } from '@/api/scheduleApi'

const scheduleData = useScheduleApi()
const chartDataRef = ref<ChartData<'bar' | 'line'> | null>(null)
let currentDataIndex = ref(0)
let updateInterval: NodeJS.Timeout | null = null

// 原有靜態數據處理
const processStaticData = () => {
  let dayAheadPredictionData: number[] = []
  let feedInBSData: number[] = []
  data.forEach((elements) => {
    const pvEnergy = elements.data.pvEnergy * 1000
    dayAheadPredictionData.push(pvEnergy)
    
    // 根據時間戳獲取對應的充電係數
    const timestamp = elements.data.timestamp
    const coefficient = chargeCoefficientMap[timestamp] || 0
    feedInBSData.push(pvEnergy * coefficient)
  })
  return { dayAheadPredictionData, feedInBSData }
}

// 新增動態數據處理
const processDynamicData = async () => {
  const response = await scheduleData.realTimeData('2023-09-30')
  const realTimeData = response.data[0].data

  const pvRawData: number[] = Array(96).fill(null)
  const socData: number[] = Array(96).fill(null)
  const dischargeData: number[] = Array(96).fill(null)

  // 只處理到當前索引的數據
  for (let i = 0; i <= currentDataIndex.value; i += 1) {
    const timePoint = realTimeData[i]
    if (timePoint) {
      pvRawData[i] = timePoint.PV_raw || 0
    }
  }

  // 計算SOC邏輯（根據需要簡化）
  let totalChargeEnergy = 0
  for (let i = 0; i <= currentDataIndex.value; i += 1) {
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
  return { pvRawData, socData, dischargeData }
}

// 合併後的數據處理
const processCombinedChartData = async (t: any): Promise<ChartData<'bar' | 'line'>> => {
  const staticData = processStaticData()
  const dynamicData = await processDynamicData()

  return {
    labels: timeLabels,
    datasets: [
      // 原有靜態數據集
      {
        label: 'DayAhead Prediction',
        type: 'line',
        borderColor: '#FFDC35',
        backgroundColor: '#FFDC35',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
        data: staticData.dayAheadPredictionData,
        yAxisID: 'y',
        pointStyle: 'line',
        order: 1,
      },
      {
        label: 'Feed-in BS by Day Ahead Model',
        type: 'bar',
        backgroundColor: 'rgba(183, 240, 247, 0.7)',
        borderColor: 'rgba(183, 240, 247, 0.9)',
        data: staticData.feedInBSData,
        borderWidth: 1,
        barPercentage: 0.85,
        categoryPercentage: 0.92,
        yAxisID: 'y',
        stack: 'stack0',
        order: 2,
        pointStyle: 'rect',
      },
      // 動態數據集
      {
        label: t('main.dashboard.real_time_chart.pv_raw'),
        type: 'line',
        backgroundColor: 'rgba(52, 100, 219, 0.3)',
        borderColor: 'rgba(52, 100, 219, 0.9)',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
        data: dynamicData.pvRawData,
        yAxisID: 'y',
        pointStyle: 'line',
      },
      {
        label: t('main.dashboard.real_time_chart.feed_in_battery'),
        type: 'bar',
        backgroundColor: 'rgba(255, 87, 51)',
        borderColor: 'rgba(255, 87, 51, 0.9)',
        borderWidth: 1,
        data: dynamicData.socData,
        yAxisID: 'y',
        barPercentage: 0.85,
        categoryPercentage: 0.92,
        stack: 'stack0',
        order: 1,
        pointStyle: 'rect',
      },
      {
        label: t('main.dashboard.real_time_chart.discharge_amount'),
        type: 'bar',
        backgroundColor: 'rgba(161, 3, 252, 0.3)',
        borderColor: 'rgba(161, 3, 252, 0.9)',
        borderWidth: 1,
        data: dynamicData.dischargeData,
        yAxisID: 'y',
        barPercentage: 0.85,
        categoryPercentage: 0.92,
        stack: 'stack0',
        order: 3,
        pointStyle: 'rect',
      },
    ],
  }
}

export const chartData = {
  async get(t: any): Promise<ChartData<'bar' | 'line'>> {
    if (!chartDataRef.value) {
      chartDataRef.value = await processCombinedChartData(t)
    }
    return chartDataRef.value
  },
  async update(t: any): Promise<ChartData<'bar' | 'line'>> {
    chartDataRef.value = await processCombinedChartData(t)
    return chartDataRef.value
  },
  startAutoUpdate(t: any) {
    if (updateInterval) clearInterval(updateInterval)
    currentDataIndex.value = 0
    
    updateInterval = setInterval(async () => {
      if (currentDataIndex.value < 95) {
        currentDataIndex.value += 1
      } else {
        currentDataIndex.value = 0
      }
      await this.update(t)
    }, 1000)
  },
  stopAutoUpdate() {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  },
}

export const getChartOptions = (): ChartOptions<'bar'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333333',
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'PV Prediction Comparison',
        color: '#333333',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333333',
        bodyColor: '#333333',
        borderColor: '#dddddd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        cornerRadius: 6,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ''
            if (label) label += ': '
            if (context.parsed.y !== null) {
            // 添加單位轉換邏輯
              const value = Math.abs(context.parsed.y)
              const unit = context.dataset.label?.includes('Prediction') ? 'kW' : 'kWh'
              return `${label}${value.toFixed(2)} ${unit}`
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
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#666666',
          maxRotation: 90,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 96, // 減少刻度數量，每小時顯示一個刻度
          font: {
            size: 10,
          },
        },
        border: {
          display: true,
          color: '#dddddd',
        },
        title: {
          display: true,
          text: 'Time 24(hr)',
          color: '#666666',
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: {
            top: 0,
            bottom: 10,
          },
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#666666',
          font: {
            size: 10,
          },
          callback: function (value) {
            return `${value} kW`
          },
        },
        border: {
          display: true,
          color: '#dddddd',
        },
        title: {
          display: true,
          text: 'Power (kW)',
          color: '#666666',
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: {
            top: 0,
            bottom: 10,
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
      duration: 200, // 進一步減少動畫時間
      easing: 'easeInOutQuart',
    },
    // 添加性能優化選項
    elements: {
      point: {
        radius: 0, // 不顯示點
        hitRadius: 5, // 但保留懸停檢測
      },
      line: {
        borderWidth: 1.5, // 減少線寬
      },
      bar: {
        borderWidth: 0, // 移除條形圖邊框
      },
    },
    // 禁用不必要的功能
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  }
}