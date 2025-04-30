import data from '@/assets/data.json'
import { ChartData, ChartOptions } from 'chart.js'
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

// Function to process data and create chart datasets
const processChartData = (): ChartData<'bar' | 'line'> => {
  let dayAheadPredictionData: number[] = []
  let feedInBSData: number[] = []
  data.forEach(elements => {
    dayAheadPredictionData.push(elements.data.pvEnergy*1000)
    feedInBSData.push(-elements.data.esEnergy*1000)
  })

  // 創建新的圖表數據
  const newChartData: ChartData<'bar' | 'line'> = {
    labels: timeLabels,
    datasets: [
      {
        label: 'DayAhead Prediction',
        type: 'line',
        borderColor: '#2196F3', // 更改為藍色
        backgroundColor: 'rgba(33, 150, 243, 0.3)', // 半透明藍色
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: true,
        data: dayAheadPredictionData,
        yAxisID: 'y',
      },
      {
        label: 'Feed-in BS by Day Ahead Model',
        type: 'bar',
        backgroundColor: 'rgba(255, 152, 0, 0.7)', // 更改為橙色
        borderColor: 'rgba(255, 152, 0, 0.9)', // 橙色邊框
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
  return newChartData
}

export const chartData = {
  get(): ChartData<'bar' | 'line'> {
    return processChartData()
  },
}

export const chartOptions: ChartOptions<'bar'> = {
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
      text: 'PV Day Ahead Prediction',
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
        maxTicksLimit: 96, // 減少刻度數量，每小時顯示一個刻度
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
