<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const data = {
  labels: [
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
  ],
  datasets: [
    {
      label: 'newPvSystemPrediction',
      borderColor: '#0745FF',
      borderDash: [10, 10],
      yAxisID: 'y',
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3465, 0, 0, 0, 0, 0,
        0, 0, 14.7275, 63.0145, 134.4235, 306.594, 703.803, 940.4895, 1179.1035,
        1500, 1778.233, 2069.6065, 2229.7935, 2492.8555, 2748.847, 2883.646,
        2716.61, 2630.463, 2532.9975, 2568.1165, 3433.68, 4000, 3015.822,
        3253.3565, 3190.785, 3587.483, 3547.3335, 3519.6605, 3518.625, 3463.039,
        3342.722, 2913.025, 3061.446, 3094.324, 2914.9635, 2883.134, 2601.694,
        2414.6245, 2196.628, 1998.7955, 1779.225, 1464.39, 1215.701, 967.385,
        727.381, 422.621, 235.715, 143.419, 29.1795, 0, 0, 0.2705, 2.6065,
        3.592, 3.9775, 3.577, 3.526, 3.1675, 2.7685, 2.507, 2.358, 2.1585,
        1.9045, 1.8645, 1.7915, 1.776, 1.7205, 3.271, 3.9965, 5.5485, 5.794,
        4.0605, 0, 2.019,
      ],
      pointRadius: 0, // 不顯示圓點
      pointHoverRadius: 0, // 不顯示圓點的懸停效果
    },
    {
      label: 'newPvSystem',
      backgroundColor: '#ffc107',
      borderColor: '#ffc107',
      yAxisID: 'y',
      data: [],
    },
  ],
}

const option = {
  responsive: true, // Ensure the chart is responsive
  maintainAspectRatio: false, // Allow the chart to resize with its container

  // Title configuration
  plugins: {
    title: {
      display: true,
      text: 'PV System Prediction', // Title of the chart
      color: '#000000',
      font: {
        size: 18,
      },
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: TooltipItem<'line'>) {
          // 這裡的 'line' 是圖表類型
          return `${tooltipItem.dataset.label}: ${(tooltipItem.raw as number).toFixed(2)} kW`
        },
      },
    },
    legend: {
      labels: {
        color: '#000000',
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#000000',
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Power (kW)',
        color: '#000000',
      },
      ticks: {
        color: '#000000',
      },
    },
  },
}
</script>

<template>
  <Line :data="data" :options="option" />
</template>
