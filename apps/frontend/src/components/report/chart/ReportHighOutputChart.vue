<script setup lang="ts">
import BarChart from './BarChart.vue'

defineProps<{ reportType: 'monthly' | 'quarterly' | 'yearly' }>()
</script>

<template>
  <BarChart
    title="High Voltage Side Output Power (kWh)"
    label="Output Power (kWh)"
    :maxY="5967"
    :reportType="reportType"
  />
</template>
