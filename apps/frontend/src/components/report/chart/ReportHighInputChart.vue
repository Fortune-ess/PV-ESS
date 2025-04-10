<script setup lang="ts">
import BarChart from './BarChart.vue'

defineProps<{ reportType: 'monthly' | 'quarterly' | 'yearly' }>()
</script>

<template>
  <BarChart
    title="High Voltage Side Input Power (kWh)"
    label="Input Power (kWh)"
    :maxY="6177"
    :reportType="reportType"
  />
</template>
