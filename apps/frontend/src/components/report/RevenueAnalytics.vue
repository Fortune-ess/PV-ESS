<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
} from 'chart.js';

ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  Filler
);

const { t } = useI18n();

const selectedPeriod = ref('Day');
const chartContainer = ref(null);

// Placeholder chart data - adapt as needed
const chartData = computed(() => {
  // In a real app, you'd fetch/calculate this based on selectedPeriod
  let labels = [];
  let actualData = [];
  let estimatedData = [];

  if (selectedPeriod.value === 'Day') {
    labels = ['May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'];
    actualData = [13780, 15120, 8760, 12680, 14380, 15872, 16000]; // Example data
    estimatedData = [13000, 14500, 9000, 12000, 14000, 15500, 15800]; // Example data
  } else if (selectedPeriod.value === 'Week') {
    labels = ['Week 18', 'Week 19', 'Week 20', 'Week 21'];
    actualData = [80000, 85000, 90000, 92000]; // Example weekly data
    estimatedData = [78000, 82000, 88000, 90000]; // Example weekly data
  } else if (selectedPeriod.value === 'Month') {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    actualData = [300000, 320000, 310000, 330000, 342680]; // Example monthly data
    estimatedData = [290000, 310000, 300000, 320000, 340000]; // Example monthly data
  }

  return {
    labels,
    datasets: [
      {
        label: t('main.report.revenue_analytics.actual_revenue'),
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // Light blue background
        borderColor: '#3b82f6',
        borderWidth: 2,
        data: actualData,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true
      },
      {
        label: t('main.report.revenue_analytics.estimated_revenue'),
        backgroundColor: 'rgba(245, 158, 11, 0.05)', // Light amber background
        borderColor: '#f59e0b',
        borderWidth: 2,
        borderDash: [5, 5],
        data: estimatedData,
        tension: 0.4,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true
      }
    ]
  };
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(160, 174, 192, 0.1)',
        drawBorder: false
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif"
        },
        color: '#718096',
        padding: 10,
        callback: function(value) {
          return 'NT$ ' + value.toLocaleString();
        }
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif"
        },
        color: '#718096',
        padding: 10
      },
      title: {
        display: true,
        text: '時間週期',
        color: '#4a5568',
        font: {
          size: 14,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        padding: {
          top: 10,
          bottom: 0
        }
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        font: {
          size: 12,
          family: "'Inter', sans-serif"
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1a202c',
      bodyColor: '#4a5568',
      borderColor: 'rgba(203, 213, 224, 0.5)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += 'NT$ ' + context.parsed.y.toLocaleString();
          }
          return label;
        }
      }
    }
  },
  interaction: {
    mode: 'index',
    intersect: false
  },
  animation: {
    duration: 1000,
    easing: 'easeOutQuart'
  }
});

// Apply theme based on dark mode
onMounted(() => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  if (isDarkMode) {
    chartOptions.value.scales.y.grid.color = 'rgba(75, 85, 99, 0.2)';
    chartOptions.value.scales.y.ticks.color = '#9ca3af';
    chartOptions.value.scales.x.ticks.color = '#9ca3af';
    chartOptions.value.plugins.tooltip.backgroundColor = 'rgba(31, 41, 55, 0.9)';
    chartOptions.value.plugins.tooltip.titleColor = '#f3f4f6';
    chartOptions.value.plugins.tooltip.bodyColor = '#d1d5db';
    chartOptions.value.plugins.tooltip.borderColor = 'rgba(75, 85, 99, 0.3)';
  }
});
</script>

<template>
  <section class="mb-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ t('main.report.revenue_analytics.title') }}</h2>
      <div class="flex space-x-2">
        <button
          v-for="period in ['Day', 'Week', 'Month']"
          :key="period"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out',
            selectedPeriod === period
              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
          @click="selectedPeriod = period"
        >
          {{ t('main.report.revenue_analytics.period_' + period.toLowerCase()) }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <!-- Revenue Line Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <h3 class="text-base font-semibold text-gray-700 dark:text-gray-300 mb-6">{{ t('main.report.revenue_analytics.revenue_trend') }}</h3>
        <div class="h-80 relative" ref="chartContainer">
          <Line :data="chartData" :options="chartOptions" />
        </div>
        <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div class="flex justify-between items-center text-sm">
            <div class="text-gray-500 dark:text-gray-400">
              {{ selectedPeriod === 'Day' ? 'Last 7 days' : selectedPeriod === 'Week' ? 'Last 4 weeks' : 'Last 5 months' }}
            </div>
            <div class="font-medium text-blue-600 dark:text-blue-400">
              {{ 'NT$ ' + chartData.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString() }} Total
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template> 