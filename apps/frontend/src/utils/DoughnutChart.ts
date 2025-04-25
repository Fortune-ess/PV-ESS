import { fetchData } from '@/services/fetch-schedule-data'
import { ScheduleData } from '@/types'
import { ArcElement, ChartData, Chart as ChartJS, ChartOptions, Legend, Tooltip } from 'chart.js'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// 定義最大 SOC 值
const MAX_SOC = 11.5
const TARGET_SOC = 8.19

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

    // 檢查是否已達標
    const isTargetReached = socValue >= TARGET_SOC
    const statusText = isTargetReached ? 'Charged' : 'Charging'

    const textMetrics = ctx.measureText(text)
    const padding = fontSize * 0.5

    ctx.beginPath()
    ctx.arc(
      centerX,
      centerY,
      Math.max(textMetrics.width, fontSize) / 2 + padding,
      0,
      Math.PI * 2
    )
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fill()

    ctx.fillStyle = '#1f2937'
    ctx.fillText(text, centerX, centerY)

    // 顯示狀態文字（無論是否達標都顯示）
    ctx.font = `bold ${fontSize * 0.5}px Arial`
    ctx.fillStyle = isTargetReached ? '#10B981' : '#eb9234' // 達標時綠色，未達標時橙色
    ctx.fillText(statusText, centerX, centerY + fontSize * 0.7)

    ctx.restore()
  }
}

// 圖表數據引用
const chartDataRef = ref<ChartData<'doughnut'> | null>(null)
const lastUpdateTime = ref<number>(Date.now())
let lastProcessedData: ScheduleData[] = []
let lastProcessedResult: ChartData<'doughnut'> | null = null

// 處理圖表數據
const processChartData = async (t: ReturnType<typeof useI18n>['t']): Promise<ChartData<'doughnut'>> => {
  const dataPoints = await fetchData()

  // 檢查數據是否有變化，如果沒有變化則直接返回緩存的圖表數據
  if (dataPoints.length === lastProcessedData.length &&
    JSON.stringify(dataPoints) === JSON.stringify(lastProcessedData) &&
    lastProcessedResult) {
    return lastProcessedResult
  }

  // 更新緩存的數據
  lastProcessedData = JSON.parse(JSON.stringify(dataPoints))

  // 設定目標時間範圍
  const targetTime = '2023-09-30T00:00:00+08:00'
  const endTime = '2023-09-30T23:45:00+08:00'

  // 計算 SOC 值
  let totalEnergy = 0
  let maxSoc = 0

  // 修改資料處理邏輯 - 使用更高效的方式
  if (dataPoints && dataPoints.length > 0) {
    // 找到目標時間的索引
    const targetIndex = dataPoints.findIndex(item => String(item.data.timestamp) === targetTime)
    const endIndex = dataPoints.findIndex(item => String(item.data.timestamp) === endTime)

    if (targetIndex !== -1) {
      // 直接從目標時間開始處理數據
      for (let i = targetIndex; i < dataPoints.length; i++) {
        const item = dataPoints[i]
        totalEnergy += item.data.esEnergy || 0
        maxSoc = Math.max(maxSoc, item.data.soc || 0)

        // 如果到達結束時間，停止處理
        if (i === endIndex) break
      }
    }
  }

  // 計算 SOC 百分比，最大為 100%
  const soc = maxSoc > 0 ? maxSoc : 0
  const percentage = Math.min((soc / MAX_SOC) * 100, 100)
  const charged = Math.min(Math.max(percentage, 0), 100)
  const remaining = 100 - charged

  // 檢查是否已達標
  const isTargetReached = soc >= TARGET_SOC

  // 創建新的圖表數據
  const newChartData: ChartData<'doughnut'> = {
    labels: [
      t('main.dashboard.doughnut_chart.charged'),
      t('main.dashboard.doughnut_chart.remaining'),
    ],
    datasets: [
      {
        backgroundColor: isTargetReached ? ['#10B981', '#E5E7EB'] : ['#eb9234', '#37eb34'],
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
  async get(t: ReturnType<typeof useI18n>['t']): Promise<ChartData<'doughnut'>> {
    if (!chartDataRef.value) {
      chartDataRef.value = await processChartData(t)
    }
    return chartDataRef.value
  },
  async update(t: ReturnType<typeof useI18n>['t']): Promise<ChartData<'doughnut'>> {
    lastUpdateTime.value = Date.now()
    chartDataRef.value = await processChartData(t)
    return chartDataRef.value
  }
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
            const label = context.label || '';
            const value = context.raw || 0;
            const isTargetReached = socValue >= TARGET_SOC;

            if (isTargetReached && context.dataIndex === 0) {
              return `${label}: ${value.toFixed(2)}% (Charged)`;
            }
            return `${label}: ${value.toFixed(2)}%`;
          }
        }
      }
    },
    layout: {
      padding: {
        bottom: 20
      }
    },
    // 添加性能優化選項
    animation: {
      duration: 200, // 減少動畫時間
    },
    elements: {
      arc: {
        borderWidth: 0, // 移除邊框
      }
    }
  }

  return options as ChartOptions<'doughnut'>
}

// 註冊插件和必要的組件
ChartJS.register(ArcElement, Tooltip, Legend, centerTextPlugin)
