<script setup lang="ts">
const stats = [
  { title: 'current_soc_total_charge', value: '5760.875' },
  { title: 'current_remaining_charge', value: '0' },
  { title: 'total_charge_amount', value: '100000' },
  { title: 'output_to_grid_amount', value: '68000' },
]
</script>

<template>
  <div class="lg:w-64 flex flex-col gap-4">
    <div
      v-for="stat in stats"
      :key="stat.title"
      class="text-black backdrop-blur-[30px] rounded-xl bg-white/70 shadow-2xl shadow-white/90 flex flex-col justify-center p-4"
    >
      <div class="text-xs text-gray-500">
        {{ $t(`main.dashboard.${stat.title}`) }}
      </div>
      <div class="font-bold text-base">
        {{ stat.value }}
      </div>
    </div>
  </div>
</template>
