import { ChartData, ChartOptions } from 'chart.js'

// API endpoint
const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/schedule/day-ahead/2023-09-30`

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

// Function to fetch data from the API
const fetchData = async (): Promise<any[]> => {
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Fetching data error:', error)
    return [] // Return an empty array in case of an error
  }
}

// Function to process data and create chart datasets
const processChartData = async (): Promise<ChartData<'bar' | 'line'>> => {
  const apiData = await fetchData()

  // Extract data from the API response and multiply by 1000
  const dayAheadPredictionData = apiData.map(
    (item: any) => item.data.pvEnergy * 1000,
  ) // Assuming pvEnergy is the DayAhead Prediction
  const feedInFeederData = apiData.map((item: any) => item.data.esEnergy * 1000) // Assuming esEnergy represents Feed-in Feeder data
  const feedInBSData = apiData.map((item: any) => item.data.esHSL * 1000) // Assuming esHSL represents Feed-in BS data

  // 只顯示09:00到14:30的數據
  const filteredFeedInFeederData = timeLabels.map((label, index) => {
    const hour = parseInt(label.split(':')[0])
    const minute = parseInt(label.split(':')[1])

    if (
      (hour === 9 && minute >= 0) ||
      (hour > 9 && hour < 14) ||
      (hour === 14 && minute <= 30)
    ) {
      return feedInFeederData[index]
    }
    return null
  })

  const filteredFeedInBSData = timeLabels.map((label, index) => {
    const hour = parseInt(label.split(':')[0])
    const minute = parseInt(label.split(':')[1])

    if (
      (hour === 9 && minute >= 0) ||
      (hour > 9 && hour < 14) ||
      (hour === 14 && minute <= 30)
    ) {
      return feedInBSData[index]
    }
    return null
  })

  // Create datasets for the chart
  const chartData: ChartData<'bar' | 'line'> = {
    labels: timeLabels,
    datasets: [
      {
        label: 'DayAhead Prediction',
        type: 'line',
        borderColor: 'blue',
        data: dayAheadPredictionData,
        yAxisID: 'y',
      },
      // {
      //   label: 'Feed-in Feeder',
      //   type: 'bar',
      //   backgroundColor: 'rgba(255, 165, 0, 0.7)', // 半透明橙色
      //   data: filteredFeedInFeederData,
      //   yAxisID: 'y',
      //   stack: 'stack0', // 使用相同的堆疊組
      //   order: 2, // 較高的順序值會先繪製（在底層）
      //   barPercentage: 1.5, // 增加條形圖的寬度百分比
      //   categoryPercentage: 0.9, // 增加類別的寬度百分比
      // },
      {
        label: 'Feed-in BS by Day Ahead Model',
        type: 'bar',
        backgroundColor: 'rgba(0, 128, 0, 0.7)', // 半透明綠色
        data: filteredFeedInBSData,
        yAxisID: 'y',
        stack: 'stack0', // 使用相同的堆疊組
        order: 1, // 較低的順序值會後繪製（在頂層）
        barPercentage: 1.5, // 增加條形圖的寬度百分比
        categoryPercentage: 0.9, // 增加類別的寬度百分比
      },
    ],
  }

  return chartData
}

// 導出圖表數據
export const chartData = {
  async get(): Promise<ChartData<'bar' | 'line'>> {
    return await processChartData()
  },
}

// 導出圖表選項
export const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#000000',
      },
    },
    title: {
      display: true,
      text: 'Energy Schedule Chart',
      color: '#000000',
    },
    tooltip: {
      mode: 'index', // 顯示同一時間點的所有數據
      intersect: false,
    },
  },
  scales: {
    x: {
      stacked: false, // 不堆疊 X 軸
      ticks: {
        color: '#000000',
        maxRotation: 90,
        minRotation: 0,
        autoSkip: true,
        maxTicksLimit: 64, // Display one tick every 15 minutes
      },
    },
    y: {
      stacked: false, // 不堆疊 Y 軸，允許重疊
      beginAtZero: true,
      ticks: {
        color: '#000000',
      },
      title: {
        display: true,
        text: 'Power (W)',
        color: '#000000',
      },
    },
  },
}
