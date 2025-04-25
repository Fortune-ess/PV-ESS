<script setup lang="ts">
import { fetchRealTimeData } from '@/services/fetch-realtime-data';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const today_accumulated_income = ref(0);
const this_month_accumulated_income = ref(0);
const today_electricity_value = ref(0);
const abandonLightValue = ref('None');
let updateInterval: ReturnType<typeof setInterval> | null = null;
let lastProcessedData = ref<any>(null);

const updateData = async () => {
  const realtime_data = await fetchRealTimeData();
  if (!realtime_data || realtime_data.length === 0) {
    return;
  }

  const latestData = realtime_data[realtime_data.length - 1];

  // 如果是新數據
  if (!lastProcessedData.value || lastProcessedData.value.PV_raw !== latestData.PV_raw) {
    // 更新發電量
    today_electricity_value.value = parseFloat((today_electricity_value.value + latestData.PV_raw).toFixed(2));
    // 更新收益
    today_accumulated_income.value = parseFloat((today_accumulated_income.value + latestData.PV_raw * 9.39).toFixed(2));
    // 更新月收益
    this_month_accumulated_income.value = parseFloat((today_accumulated_income.value * 30).toFixed(2));
    // 更新最後處理的數據
    lastProcessedData.value = latestData;
  }
};

onMounted(() => {
  // 初始化時重置數據
  today_accumulated_income.value = 0;
  this_month_accumulated_income.value = 0;
  today_electricity_value.value = 0;
  lastProcessedData.value = null;
  
  // Initial update
  updateData();
  
  // 每秒更新一次
  updateInterval = setInterval(updateData, 1000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});

const stats = computed(() => [
  { title: 'today_accumulated_income', value: today_accumulated_income.value },
  { title: 'this_month_accumulated_income', value: this_month_accumulated_income.value },
  { title: 'today_generation_degree', value: today_electricity_value.value },
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
