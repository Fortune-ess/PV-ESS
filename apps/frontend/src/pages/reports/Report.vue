<script setup lang="ts">
import ReportAuxChart from '@/components/report/chart/ReportAuxChart.vue'
import ReportAverageBarChart from '@/components/report/chart/ReportAverageBarChart.vue'
import ReportHighInputChart from '@/components/report/chart/ReportHighInputChart.vue'
import ReportHighOutputChart from '@/components/report/chart/ReportHighOutputChart.vue'
import ReportHighPowerChart from '@/components/report/chart/ReportHighPowerChart.vue'
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
      data.push({ date: `Day ${day}`, value: 'Sample Data' })
    }
  } else if (reportType.value === 'quarterly') {
    for (let month = 1; month <= 4; month += 1) {
      data.push({ date: `Q${month}`, value: 'Sample Data' })
    }
  } else {
    for (let month = 1; month <= 12; month += 1) {
      data.push({ date: `Month ${month}`, value: 'Sample Data' })
    }
  }
  return data
})
</script>

<template>
  <div class="min-h-screen p-4 space-y-4">
    <!-- 控制區 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div
          class="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto"
        >
          <!-- 日期選擇 -->
          <input
            type="month"
            v-model="selectedMonth"
            class="px-3 py-2 bg-white/40 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-all w-full md:w-auto text-sm"
          />

          <!-- 圖表選擇 -->
          <div class="relative w-full md:w-64">
            <button
              @click="toggleMenu"
              class="w-full px-3 py-2 bg-white/40 border border-gray-200 rounded-md text-gray-700 flex items-center justify-between gap-2 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
            >
              <span class="truncate">{{
                chartTitles[selectedChart] || 'Select a chart...'
              }}</span>
              <svg
                class="w-4 h-4 text-gray-500 transform transition-transform duration-200"
                :class="{ 'rotate-180': isMenuOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="isMenuOpen"
              class="absolute z-50 w-full mt-1 py-1 bg-white rounded-md shadow-lg border border-gray-100 max-h-48 overflow-y-auto"
            >
              <div
                v-for="(title, key) in chartTitles"
                :key="key"
                @click="handleSelectedChart(key)"
                class="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                {{ title }}
              </div>
            </div>
          </div>
        </div>

        <!-- 報表類型選擇 -->
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="type in ['yearly', 'quarterly', 'monthly']"
            :key="type"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
            :class="[
              reportType === type
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : 'text-gray-500 hover:bg-gray-50 border border-transparent',
            ]"
            @click="reportType = type as 'monthly' | 'quarterly' | 'yearly'"
          >
            {{ type.charAt(0).toUpperCase() + type.slice(1) }}
          </button>
        </div>
      </div>
    </div>

    <!-- 圖表區域 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h2 class="text-base font-semibold text-gray-800 mb-3">Report Summary</h2>
      <div class="w-full h-[360px] relative">
        <component
          :is="chartComponents[selectedChart]"
          :reportType="reportType"
          :selectedMonth="selectedMonth"
        />
      </div>
    </div>

    <!-- 詳細數據表格 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h2 class="text-base font-semibold text-gray-800 mb-3">
        Detailed Report
      </h2>
      <div class="max-h-[320px] overflow-y-auto">
        <table class="w-full border-collapse">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b border-gray-200"
              >
                Date
              </th>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b border-gray-200"
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in tableData"
              :key="index"
              class="hover:bg-gray-50"
            >
              <td class="px-3 py-2 text-sm text-gray-700">{{ item.date }}</td>
              <td class="px-3 py-2 text-sm text-gray-700">{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
