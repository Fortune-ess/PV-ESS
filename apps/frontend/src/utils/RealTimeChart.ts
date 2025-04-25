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

  if (realTimeData.length === lastProcessedData.length &&
    JSON.stringify(realTimeData) === JSON.stringify(lastProcessedData) &&
    lastProcessedResult) {
    return lastProcessedResult
  }

  lastProcessedData = JSON.parse(JSON.stringify(realTimeData))

  // 初始化數據陣列
  const pvImmData: number[] = []
  const pvDAData: number[] = []
  const pvRawData: number[] = []


  // 處理實時數據
  if (realTimeData && realTimeData.length > 0) {

    for (let i = 0; i < realTimeData.length; i++) {
      pvImmData.push(realTimeData[i]?.PV_pImm || 0)
      pvDAData.push(realTimeData[i]?.PV_pDA || 0)
      pvRawData.push(realTimeData[i]?.PV_raw || 0)
    }
  }

  // 創建新的圖表數據
  const newChartData: ChartData<'bar' | 'line'> = {
    labels: timeLabels,
    datasets: [
      {
        label: 'pv_imm',
        type: 'line',
        borderColor: '#4e79a7',
        backgroundColor: 'rgba(78, 121, 167, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: false,
        data: pvImmData,
        yAxisID: 'y',
      },
      {
        label: 'pv_da',
        type: 'line',
        borderColor: '#f28e2c',
        backgroundColor: 'rgba(242, 142, 44, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5], // 虛線
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: false,
        data: pvDAData,
        yAxisID: 'y',
      },
      {
        label: 'pv_raw',
        type: 'bar',
        backgroundColor: 'rgba(59, 125, 191, 0.8)', // 較深的顏色
        borderColor: 'rgba(59, 125, 191, 1)',
        borderWidth: 1,
        data: pvRawData,
        yAxisID: 'y',
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
    chartDataRef.value = await processChartData(t)
    return chartDataRef.value
  }
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
        text: 'pv_title',
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
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + ' kW';
            }
            return label;
          }
        }
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
            return value + ' kW';
          },
        },
        border: {
          display: true,
          color: '#dddddd',
        },
        title: {
          display: true,
          text: 'power',
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
