import { fetchData } from '@/services/fetch-schedule-data'
import { ScheduleData } from '@/types'
import { ChartData, ChartOptions } from 'chart.js'
import { ref } from 'vue'
import { timeLabels } from '@/config/timeMaps'

const chartDataRef = ref<ChartData<'bar' | 'line'> | null>(null)
const lastUpdateTime = ref<number>(Date.now())
let lastProcessedData: ScheduleData[] = []
let lastProcessedResult: ChartData<'bar' | 'line'> | null = null

// Function to process data and create chart datasets
const processChartData = async (t: any): Promise<ChartData<'bar' | 'line'>> => {
  const dataPoints = await fetchData()

  // 檢查數據是否有變化，如果沒有變化則直接返回緩存的圖表數據
  if (
    dataPoints.length === lastProcessedData.length &&
    JSON.stringify(dataPoints) === JSON.stringify(lastProcessedData) &&
    lastProcessedResult
  ) {
    return lastProcessedResult
  }

  // 更新緩存的數據
  lastProcessedData = JSON.parse(JSON.stringify(dataPoints))

  // 初始化數據陣列 - 使用固定長度96（24小時 * 4個15分鐘）
  let dayAheadPredictionData: number[] = []
  let feedInFeederData: number[] = []
  let feedInBSData: number[] = []
  const targetTime = '2023-09-30T00:00:00+08:00'
  const endTime = '2023-09-30T23:45:00+08:00'

  // 修改資料處理邏輯 - 使用更高效的方式
  if (dataPoints && dataPoints.length > 0) {
    // 找到目標時間的索引
    const targetIndex = dataPoints.findIndex(
      (item) => String(item.data.timestamp) === targetTime,
    )
    const endIndex = dataPoints.findIndex(
      (item) => String(item.data.timestamp) === endTime,
    )

    if (targetIndex !== -1) {
      // 直接從目標時間開始處理數據
      for (let i = targetIndex; i < dataPoints.length; i += 1) {
        const item = dataPoints[i]
        dayAheadPredictionData.push(item.data.pvEnergy)
        feedInFeederData.push(item.data.esHSL)
        feedInBSData.push(-item.data.esEnergy)

        // 如果到達結束時間，停止處理
        if (i === endIndex) break
      }
    }
  }

  // 創建新的圖表數據
  const newChartData: ChartData<'bar' | 'line'> = {
    labels: timeLabels,
    datasets: [
      {
        label: t('main.schedule.chart.day_ahead_charge_prediction'),
        type: 'line',
        borderColor: '#4e79a7',
        backgroundColor: 'rgba(78, 121, 167, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: true,
        data: dayAheadPredictionData,
        yAxisID: 'y',
      },
      {
        label: t('main.schedule.chart.day_ahead_feed_in_bs'),
        type: 'bar',
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgba(76, 175, 80, 0.9)',
        borderWidth: 1,
        data: feedInBSData,
        yAxisID: 'y',
        stack: 'stack0',
        order: 1,
        barPercentage: 0.8,
        categoryPercentage: 0.9,
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
    lastUpdateTime.value = Date.now()
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
        text: t('main.schedule.chart.title'),
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
        stacked: false,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#666666',
          maxRotation: 90,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 48, // 減少刻度數量，每小時顯示一個刻度
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
          text: 'Day',
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
          text: t('main.schedule.chart.power'),
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
