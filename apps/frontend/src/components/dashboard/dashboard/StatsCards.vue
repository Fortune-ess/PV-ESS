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

<script setup lang="ts">
const stats = [
  { title: 'today_accumulated_income', value: '$62,263' },
  { title: 'this_month_accumulated_income', value: '$2,100,000' },
  { title: 'today_generation_degree', value: '16,384,875' },
  { title: 'abandon_light', value: 'None' },
]
</script>
