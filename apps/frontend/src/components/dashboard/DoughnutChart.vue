<script setup lang="ts">
import { useScheduleStore } from '@/store/useSocketStore'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { computed, ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const socketStore = ref(useScheduleStore())

// 取出 soc 百分比
const soc = computed(() => {
  return socketStore.value.scheduleData?.data?.soc || 0
})

// 中心文字 plugin
const centerTextPlugin = {
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
    
    const text = `${Math.round(soc.value)}%`
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
    
    ctx.restore()
  }
}

// 圖表資料
const data = computed(() => {
  const charged = Math.min(Math.max(soc.value, 0), 100)
  const remaining = 100 - charged

  return {
    labels: [
      t('main.dashboard.doughnut_chart.charged'),
      t('main.dashboard.doughnut_chart.remaining'),
    ],
    datasets: [
      {
        backgroundColor: ['#eb9234', '#37eb34'],
        borderWidth: 0,
        data: [charged, remaining],
        hoverOffset: 4,
      },
    ],
  }
})

// 圖表選項
const option = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    // 添加標識
    isBatteryChart: true,
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
    }
  },
  layout: {
    padding: {
      bottom: 20
    }
  }
}))

// 註冊插件和必要的組件
ChartJS.register(ArcElement, Tooltip, Legend, centerTextPlugin)
</script>

<template>
  <div class="chart-wrapper">
    <Doughnut :data="data" :options="option" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>
