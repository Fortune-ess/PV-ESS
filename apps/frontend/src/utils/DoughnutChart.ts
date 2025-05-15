import { ChartData, Chart as ChartJS, ChartOptions, ArcElement, Legend, Tooltip } from 'chart.js'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  MAX_SOC,
  TARGET_SOC,
} from '@/config/timeMaps'
import { chartData as realTimeChartData } from './RealTimeChart'

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

    // 將 ctx 圖層往下移動
    ctx.globalCompositeOperation = 'destination-over'
    
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

    // 恢復正常繪製模式
    ctx.globalCompositeOperation = 'source-over'
    
    ctx.fillStyle = '#1f2937'
    ctx.fillText(text, centerX, centerY)

    ctx.restore()
  },
}

// 圖表數據引用
const chartDataRef = ref<ChartData<'doughnut'> | null>(null)
const lastUpdateTime = ref<number>(Date.now())
let lastProcessedResult: ChartData<'doughnut'> | null = null
let updateInterval: NodeJS.Timeout | null = null

// 處理圖表數據
const processChartData = async (
  t: ReturnType<typeof useI18n>['t'],
): Promise<ChartData<'doughnut'>> => {
  // 從 RealTimeChart 獲取數據
  const realTimeData = await realTimeChartData.get(t)

  // 計算總充電量和放電量
  let totalChargeEnergy = 0
  let totalDischargeEnergy = 0

  // 從 RealTimeChart 的數據集中獲取充電和放電數據
  const chargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.feed_in_battery'))
  const dischargeDataset = realTimeData.datasets.find(ds => ds.label === t('main.dashboard.real_time_chart.discharge_amount'))
  if (chargeDataset?.data) {
    totalChargeEnergy = chargeDataset.data.reduce((sum: number, val: any) => sum + (val || 0), 0)
  }

  if (dischargeDataset?.data) {
    totalDischargeEnergy = dischargeDataset.data.reduce((sum: number, val: any) => sum + (val || 0), 0)
  }

  // 計算最終的 SOC 值（考慮放電）
  const finalSoc = Math.max(0, totalChargeEnergy - totalDischargeEnergy) / 1000
  
  // 計算實際的百分比（考慮放電）
  const actualPercentage = Math.min((finalSoc / MAX_SOC) * 100, 100)
  const charged = Math.min(Math.max(actualPercentage, 0), 100)
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
  startAutoUpdate(t: ReturnType<typeof useI18n>['t']) {
    // 清除現有的定時器
    if (updateInterval) {
      clearInterval(updateInterval)
    }

    // 設置新的定時器
    updateInterval = setInterval(async () => {
      await chartData.update(t)
    }, 0)
  },
  stopAutoUpdate() {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
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
