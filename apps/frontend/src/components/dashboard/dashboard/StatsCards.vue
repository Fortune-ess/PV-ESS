<script setup lang="ts">
import { useScheduleStore } from '@/store/useSocketStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const scheduleStore = useScheduleStore();
const abandonLightValue = ref('None');
let updateInterval: ReturnType<typeof setInterval> | null = null;

const calculateAbandonLight = () => {
  const dataPoints = scheduleStore.scheduleData;
  if (!dataPoints || dataPoints.length === 0) {
    return 'None';
  }

  const targetTime = '2023-09-30T00:00:00+08:00';
  const endTime = '2023-09-30T23:45:00+08:00';

  const targetIndex = dataPoints.findIndex(item => String(item.data.timestamp) === targetTime);
  const endIndex = dataPoints.findIndex(item => String(item.data.timestamp) === endTime);

  if (targetIndex === -1) {
    return 'None';
  }

  let totalAbandonLight = 0;
  for (let i = targetIndex; i < dataPoints.length; i++) {
    const item = dataPoints[i];
    // Calculate abandon light as the difference between PV energy and ES energy
    totalAbandonLight = item.data.status;

    if (i === endIndex) break;
  }

  return totalAbandonLight + '%';
};

const updateAbandonLight = () => {
  abandonLightValue.value = calculateAbandonLight();
};

onMounted(() => {
  // Initial update
  updateAbandonLight();
  
  // Update every second
  updateInterval = setInterval(updateAbandonLight, 1000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});

const stats = computed(() => [
  { title: 'today_accumulated_income', value: '$62,263' },
  { title: 'this_month_accumulated_income', value: '$2,100,000' },
  { title: 'today_generation_degree', value: '16,384,875' },
  { title: 'abandon_light', value: abandonLightValue.value },
]);
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
