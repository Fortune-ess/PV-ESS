<script setup lang="ts">
import BarChart from './BarChart.vue'

defineProps<{ reportType: 'monthly' | 'quarterly' | 'yearly' }>()
</script>

<template>
  <BarChart
    title="High Voltage Side Power Loss (kWh)"
    label="Power Loss (kWh)"
    :maxY="1000"
    :reportType="reportType"
  />
</template>
