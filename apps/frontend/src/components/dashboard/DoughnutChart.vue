<script setup lang="ts">
import { chartData, chartOptions } from '@/utils/DoughnutChart'
import { ChartData, ChartOptions } from 'chart.js'
import { onMounted, ref, watch } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 圖表數據和選項
const doughnutData = ref<ChartData<'doughnut'> | null>(null)
const doughnutOptions = ref<ChartOptions<'doughnut'> | null>(null)
const socValue = ref(0)
const socPercentage = ref(0)
const isTargetReached = ref(false)

// 目標值和最大 SOC 值
const TARGET_SOC = 8.19
const MAX_SOC = 11.5

// 初始化圖表
onMounted(async () => {
  try {
    // 獲取圖表數據
    doughnutData.value = await chartData.get(t)
    
    // 從圖表數據中提取 SOC 值
    if (doughnutData.value && doughnutData.value.datasets.length > 0) {
      // 從數據集中獲取百分比值
      const percentage = doughnutData.value.datasets[0].data[0]
      // 計算實際的 SOC 值
      socValue.value = (percentage / 100) * MAX_SOC
      console.log('SOC value from chart data:', socValue.value)
      
      // 計算 SOC 百分比
      socPercentage.value = Math.min(Math.round((socValue.value / MAX_SOC) * 100), 100)
      isTargetReached.value = socValue.value >= TARGET_SOC
    }
    
    // 創建圖表選項
    doughnutOptions.value = chartOptions(socValue.value)
  } catch (error) {
    console.error('Error initializing doughnut chart:', error)
  }
})

// 監聽 SOC 值變化
watch(socValue, (newValue) => {
  // 計算 SOC 百分比
  socPercentage.value = Math.min(Math.round((newValue / MAX_SOC) * 100), 100)
  isTargetReached.value = newValue >= TARGET_SOC
  if (doughnutOptions.value) {
    doughnutOptions.value = chartOptions(newValue)
  }
})

// 定期更新圖表數據
const updateChart = async () => {
  try {
    // 更新圖表數據
    doughnutData.value = await chartData.update(t)
    
    // 從圖表數據中提取 SOC 值
    if (doughnutData.value && doughnutData.value.datasets.length > 0) {
      // 從數據集中獲取百分比值
      const percentage = doughnutData.value.datasets[0].data[0]
      // 計算實際的 SOC 值
      socValue.value = (percentage / 100) * MAX_SOC
      
      // 計算 SOC 百分比
      socPercentage.value = Math.min(Math.round((socValue.value / MAX_SOC) * 100), 100)
      isTargetReached.value = socValue.value >= TARGET_SOC
    }
  } catch (error) {
    console.error('Error updating doughnut chart:', error)
  }
}

// 每秒更新一次圖表
setInterval(updateChart, 1000)
</script>

<template>
  <div class="chart-wrapper">
    <!-- 添加標題 -->
    <h3 class="chart-title">{{ t('main.dashboard.doughnut_chart.title') }}</h3>
    
    <div class="chart-container">
      <Doughnut v-if="doughnutData && doughnutOptions" :data="doughnutData" :options="doughnutOptions" />
      <div v-else class="loading">Loading...</div>
      
      <!-- 目標標記 -->
      <div class="target-badge" :class="{ 'target-reached': isTargetReached }">
        <span class="target-icon">{{ isTargetReached ? '✓' : '⟳' }}</span>
        <span class="target-text">{{ isTargetReached ? 'Charged' : 'Charging' }}</span>
      </div>
    </div>
    
    <!-- 當前 SOC 值顯示 -->
    <div class="current-soc-info">
      <span class="current-soc-label">當前 SOC:</span>
      <span class="current-soc-value">{{ socValue.toFixed(2) }}</span>
      <span class="current-soc-percentage">({{ socPercentage }}%)</span>
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.2rem;
  color: #666;
}

.target-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #eb9234;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.target-reached {
  background-color: #10B981;
}

.target-icon {
  margin-right: 4px;
}

.target-info {
  margin-top: 10px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #4B5563;
}

.target-label {
  margin-right: 5px;
}

.target-value {
  font-weight: bold;
  color: #10B981;
}

.max-soc-info {
  margin-left: 10px;
  font-size: 0.8rem;
  color: #6B7280;
}

.current-soc-info {
  margin-top: 10px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #4B5563;
}

.current-soc-label {
  margin-right: 5px;
}

.current-soc-value {
  font-weight: bold;
  color: #3B82F6;
}

.current-soc-percentage {
  margin-left: 5px;
  color: #6B7280;
}
</style>
