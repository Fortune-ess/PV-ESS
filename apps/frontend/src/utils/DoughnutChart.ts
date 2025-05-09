import { fetchRealTimeData } from '@/services/fetch-realtime-data'
import type { RealTimeData } from '@/types'
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// 定義最大 SOC 值
const MAX_SOC = 73.847
const TARGET_SOC = 52.335

// 中心文字 plugin
export const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart: any) => {
    // 檢查是否是電池圖表
    if (!chart.options.plugins.isBatteryChart) return

    const { ctx, chartArea } = chart
    ctx.save()

    const centerX = (chartArea.left + chartArea.right) / 2
    const centerY = (chartArea.top + chartArea.bottom) / 2

    const fontSize = Math.min(chartArea.width / 6, chartArea.height / 6)
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillStyle = '#1f2937'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 獲取 SOC 值 - 從圖表數據中獲取
    let socValue = 0
    if (chart.data && chart.data.datasets && chart.data.datasets.length > 0) {
      // 從數據集中獲取 SOC 值
      const dataset = chart.data.datasets[0]
      if (dataset.data && dataset.data.length > 0) {
        // 計算實際的 SOC 值（從百分比轉換回實際值）
        const percentage = dataset.data[0]
        socValue = (percentage / 100) * MAX_SOC
      }
    }

    // 計算百分比，最大為 100%
    const percentage = Math.min(Math.round((socValue / MAX_SOC) * 100), 100)
    const text = `${percentage}%`

    const textMetrics = ctx.measureText(text)
    const padding = fontSize * 0.5

    ctx.beginPath()
    ctx.arc(
      centerX,
      centerY,
      Math.max(textMetrics.width, fontSize) / 2 + padding,
      0,
      Math.PI * 2,
    )
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fill()

    ctx.fillStyle = '#1f2937'
    ctx.fillText(text, centerX, centerY)

    ctx.restore()
  },
}

// 圖表數據引用
const chartDataRef = ref<ChartData<'doughnut'> | null>(null)
const lastUpdateTime = ref<number>(Date.now())
let lastProcessedData: RealTimeData[] = []
let lastProcessedResult: ChartData<'doughnut'> | null = null
let accumulatedSoc = 0 // 累加的 SOC 值
let dischargeAmount = 0 // 放電量

// 處理圖表數據
const processChartData = async (
  t: ReturnType<typeof useI18n>['t'],
): Promise<ChartData<'doughnut'>> => {
  const realTimeData = await fetchRealTimeData()

  // 檢查數據是否有變化，如果沒有變化則直接返回緩存的圖表數據
  if (
    realTimeData.length === lastProcessedData.length &&
    JSON.stringify(realTimeData) === JSON.stringify(lastProcessedData) &&
    lastProcessedResult
  ) {
    return lastProcessedResult
  }

  // 更新緩存的數據
  lastProcessedData = JSON.parse(JSON.stringify(realTimeData))

  // 初始化數據陣列
  const socData: number[] = Array(96).fill(0) // 初始化為96個0，對應每15分鐘一個時間點
  const calculateSoc = () => {
    // 重置累加的 SOC 值
    accumulatedSoc = 0
    dischargeAmount = 0

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

    // 係數映射
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
    for (let i = 0; i < realTimeData.length; i += 1) {
      const timestamp = realTimeData[i]?.timestamp

      if (timestamp && chargeTimeMap[timestamp] !== undefined) {
        const index = chargeTimeMap[timestamp]
        const coefficient = chargeCoefficientMap[timestamp]
        const chargeEnergy = (realTimeData[i]?.PV_raw * coefficient / 1000 || 0)
        socData[index] = chargeEnergy
        accumulatedSoc += chargeEnergy
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
      for (const [timestamp, { index, weight }] of Object.entries(
        dischargeTimeMap,
      )) {
        // 如果當前時間已經到達或超過該放電時間點，就顯示該時間點的放電數據
        if (currentTime && currentTime >= timestamp) {
          const dischargeEnergy = accumulatedSoc * weight
          socData[index] = dischargeEnergy
          dischargeAmount += dischargeEnergy
        }
      }
    }
    return socData
  }

  // 計算 SOC 值
  calculateSoc()
  // 計算最終的 SOC 值（考慮放電）
  const finalSoc = Math.max(0, accumulatedSoc - dischargeAmount)
  const percentage = Math.min((finalSoc / MAX_SOC) * 100, 100)
  const charged = Math.min(Math.max(percentage, 0), 100)
  const remaining = 100 - charged

  // 檢查是否已達標
  const isTargetReached = finalSoc >= TARGET_SOC

  // 創建新的圖表數據
  const newChartData: ChartData<'doughnut'> = {
    labels: [
      t('main.dashboard.doughnut_chart.charged'),
      t('main.dashboard.doughnut_chart.remaining'),
    ],
    datasets: [
      {
        backgroundColor: isTargetReached
          ? ['#10B981', '#E5E7EB']
          : ['#F59E0B', '#E5E7EB'],
        borderWidth: 0,
        data: [charged, remaining],
        hoverOffset: 4,
      },
    ],
  }

  // 緩存處理結果
  lastProcessedResult = newChartData
  return newChartData
}

// 圖表數據 API
export const chartData = {
  async get(
    t: ReturnType<typeof useI18n>['t'],
  ): Promise<ChartData<'doughnut'>> {
    if (!chartDataRef.value) {
      chartDataRef.value = await processChartData(t)
    }
    return chartDataRef.value
  },
  async update(
    t: ReturnType<typeof useI18n>['t'],
  ): Promise<ChartData<'doughnut'>> {
    lastUpdateTime.value = Date.now()
    chartDataRef.value = await processChartData(t)
    return chartDataRef.value
  },
}

// 圖表選項
export const chartOptions = (socValue: number): ChartOptions<'doughnut'> => {
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      isBatteryChart: true,
      socValue,
      legend: {
        position: 'bottom' as const,
        align: 'center' as const,
        labels: {
          color: '#4b5563',
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          boxWidth: 10,
          boxHeight: 10,
        },
        display: true,
        maxWidth: 300,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || ''
            const value = context.raw || 0
            const isTargetReached = socValue >= TARGET_SOC

            if (isTargetReached && context.dataIndex === 0) {
              return `${label}: ${value.toFixed(2)}% (Charged)`
            }
            return `${label}: ${value.toFixed(2)}%`
          },
        },
      },
    },
    layout: {
      padding: {
        bottom: 20,
      },
    },
    animation: {
      duration: 200,
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  }

  return options as ChartOptions<'doughnut'>
}

// 註冊插件和必要的組件
ChartJS.register(ArcElement, Tooltip, Legend, centerTextPlugin)
