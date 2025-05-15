<script setup lang="ts">
import ReportAuxChart from '@/components/report/chart/ReportAuxChart.vue'
import ReportAverageBarChart from '@/components/report/chart/ReportAverageBarChart.vue'
import ReportHighInputChart from '@/components/report/chart/ReportHighInputChart.vue'
import ReportHighOutputChart from '@/components/report/chart/ReportHighOutputChart.vue'
import ReportHighPowerChart from '@/components/report/chart/ReportHighPowerChart.vue'
import SolarFinancialDashboard from '@/components/report/SolarFinancialDashboard.vue'
import { computed, ref } from 'vue'

const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const reportType = ref<'monthly' | 'quarterly' | 'yearly'>('monthly')

const chartComponents = {
  ReportAverageBarChart,
  ReportAuxChart,
  ReportHighOutputChart,
  ReportHighInputChart,
  ReportHighPowerChart,
}

const chartTitles = {
  ReportAverageBarChart: 'Average Execution Rate (%)',
  ReportAuxChart: 'Auxiliary Power Consumption (kWh)',
  ReportHighOutputChart: 'High Voltage Side Output Power (kWh)',
  ReportHighInputChart: 'High Voltage Side Input Power (kWh)',
  ReportHighPowerChart: 'High Voltage Side Power Loss (kWh)',
}

const selectedChart = ref<keyof typeof chartComponents>(
  Object.keys(chartComponents)[0] as keyof typeof chartComponents,
)

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleSelectedChart = (key: keyof typeof chartComponents) => {
  selectedChart.value = key
  isMenuOpen.value = false
}

const tableData = computed(() => {
  const data = []
  if (reportType.value === 'monthly') {
    for (let day = 1; day <= 30; day += 1) {
      data.push({
        date: `Day ${day}`,
        revenue: (Math.random() * 10000).toFixed(2),
        cost: (Math.random() * 5000).toFixed(2),
        profit: (Math.random() * 5000).toFixed(2),
        efficiency: (Math.random() * 100).toFixed(2),
        roi: (Math.random() * 20).toFixed(2),
      })
    }
  } else if (reportType.value === 'quarterly') {
    for (let month = 1; month <= 4; month += 1) {
      data.push({
        date: `Q${month}`,
        revenue: (Math.random() * 100000).toFixed(2),
        cost: (Math.random() * 50000).toFixed(2),
        profit: (Math.random() * 50000).toFixed(2),
        efficiency: (Math.random() * 100).toFixed(2),
        roi: (Math.random() * 20).toFixed(2),
      })
    }
  } else {
    for (let month = 1; month <= 12; month += 1) {
      data.push({
        date: `Month ${month}`,
        revenue: (Math.random() * 100000).toFixed(2),
        cost: (Math.random() * 50000).toFixed(2),
        profit: (Math.random() * 50000).toFixed(2),
        efficiency: (Math.random() * 100).toFixed(2),
        roi: (Math.random() * 20).toFixed(2),
      })
    }
  }
  return data
})
</script>

<template>
  <SolarFinancialDashboard />
</template>
