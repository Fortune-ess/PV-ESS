<script setup lang="ts">
import BarChart from './BarChart.vue'

defineProps<{ reportType: 'monthly' | 'quarterly' | 'yearly' }>()
</script>

<template>
  <BarChart
    title="Auxiliary Power Consumption (kWh)"
    label="Power Consumption (kWh)"
    :maxY="3000"
    :reportType="reportType"
  />
</template>
