<script setup lang="ts">
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { computed, onMounted, ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 當前SOC百分比
const currentSocPercentage = ref(0)
const targetSocPercentage = ref(59) // 固定目標為59%
const animationSpeed = ref(0.5) // 降低動畫速度，使動畫更平滑

// 初始化目標SOC
onMounted(() => {
  // 啟動動畫
  animateSoc()
})

// 動畫函數
const animateSoc = () => {
  const animate = () => {
    if (currentSocPercentage.value < targetSocPercentage.value) {
      currentSocPercentage.value += animationSpeed.value
      if (currentSocPercentage.value > targetSocPercentage.value) {
        currentSocPercentage.value = targetSocPercentage.value
      }
      requestAnimationFrame(animate)
    }
  }
  animate()
}

// 圖表數據
const data = computed(() => ({
  labels: [
    t('main.dashboard.doughnut_chart.charged'),
    t('main.dashboard.doughnut_chart.remaining'),
  ],
  datasets: [
    {
      backgroundColor: ['#3b82f6', '#e5e7eb'], // 使用更現代的藍色和灰色
      borderWidth: 0, // 移除邊框
      data: [currentSocPercentage.value, 100 - currentSocPercentage.value], // 使用動態值
      hoverOffset: 4, // 懸停時突出顯示
    },
  ],
}))

// 圖表選項
const option = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%', // 增加中心孔的大小
  plugins: {
    title: {
      display: true,
      text: t('main.dashboard.doughnut_chart.title'),
      color: '#1f2937', // 深灰色文字
      font: {
        size: 16,
        weight: 'bold' as const,
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    legend: {
      labels: {
        color: '#4b5563', // 中灰色文字
        font: {
          size: 12,
          weight: 'normal' as const,
        },
        usePointStyle: true, // 使用點狀圖例
        pointStyle: 'circle',
        padding: 15,
      },
      position: 'bottom' as const, // 將圖例移到底部
      padding: 20,
    },
    centerText: {
      text: `${Math.round(currentSocPercentage.value)}%`,
      color: '#1f2937', // 深灰色文字
      font: {
        size: '8',
        weight: 'bold',
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      titleFont: {
        size: 14,
        weight: 'bold' as const,
      },
      bodyColor: '#ffffff',
      bodyFont: {
        size: 13,
        weight: 'normal' as const,
      },
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0
          return `${label}: ${value}%`
        },
      },
    },
  },
  elements: {
    arc: {
      borderWidth: 0,
      borderRadius: 5, // 添加圓角
    },
  },
  animation: {
    duration: 1000, // 增加動畫持續時間
    easing: 'easeInOutQuart' as const, // 使用更平滑的緩動函數
  },
}))

// 自定義插件，在中心繪製文字
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart: { options?: any; width?: any; height?: any; ctx?: any }) {
    const { width, height, ctx } = chart
    ctx.save()

    // 根據視窗寬度調整字型大小
    const minFontSize = 16
    const maxFontSize = (height / 6).toFixed(2)
    const fontSize = Math.max(minFontSize, Number(maxFontSize))

    ctx.font = `bold ${fontSize}px Arial`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'

    const text = chart.options.plugins.centerText.text || ''
    const textX = width / 2
    const textY = height / 2

    // 增加文字背景以確保可見性
    const textWidth = ctx.measureText(text).width
    const padding = 10

    // 繪製圓形背景
    ctx.beginPath()
    ctx.arc(
      textX,
      textY,
      Math.max(textWidth, fontSize) / 2 + padding,
      0,
      Math.PI * 2,
    )
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fill()

    // 添加陰影效果
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2

    ctx.fillStyle = chart.options.plugins.centerText.color
    ctx.fillText(text, textX, textY)

    // 重置陰影
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    ctx.restore()
  },
}

ChartJS.register(ArcElement, Tooltip, Legend, centerTextPlugin)
</script>

<template>
  <div class="chart-container">
    <Doughnut :data="data" :options="option" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.chart-container:hover {
  transform: scale(1.02);
}

@media (min-width: 768px) {
  .chart-container {
    min-height: 400px;
  }
}
</style>
