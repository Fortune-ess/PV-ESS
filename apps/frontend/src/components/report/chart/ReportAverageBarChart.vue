<script setup lang="ts">
import BarChart from './BarChart.vue'

defineProps<{ reportType: 'monthly' | 'quarterly' | 'yearly' }>()
</script>

<template>
  <BarChart
    title="Average Execution Rate (%)"
    label="Execution Rate (%)"
    :maxY="98"
    :reportType="reportType"
  />
</template>
