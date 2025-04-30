<script setup lang="ts">
import BarChart from '@/components/dashboard/BarChart.vue'
import BatteryStatus from '@/components/dashboard/dashboard/BatteryStatus.vue'
import SocCards from '@/components/dashboard/dashboard/SocCards.vue'
import PVCard from '@/components/dashboard/dashboard/PVCard.vue'
import StatsCards from '@/components/dashboard/dashboard/StatsCards.vue'
import DoughnutChart from '@/components/dashboard/DoughnutChart.vue'
import RealTimeChart from '@/components/dashboard/RealTimeChart.vue'
import TheSystem from '@/components/dashboard/TheSystem.vue'
import Weather from '@/components/dashboard/Weather.vue'

</script>

<template>
  <div class="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4">
    <!-- 左側系統監控區域 -->
    <div class="flex flex-col w-full lg:w-5/12 bg-white/40 rounded-2xl p-2 sm:p-3 md:p-4">
      <div class="flex flex-col gap-2 sm:gap-3 md:gap-4">
        <h1 class="text-sm sm:text-base md:text-xl font-medium mb-2 sm:mb-3 md:mb-4 text-black flex items-center">
          <span class="mr-2">{{ $t('main.dashboard.real_time_monitoring') }}</span>
        </h1>
        <TheSystem class="mb-2 sm:mb-3 md:mb-4" />
      </div>
      <div class="flex gap-2 sm:gap-3 md:gap-4">
        <RealTimeChart />
      </div>
    </div>

    <!-- 中間圓餅圖區域 -->
    <div class="w-full lg:w-5/12 flex flex-col bg-white/40 rounded-2xl p-2 sm:p-3 md:p-4 gap-2 sm:gap-3 md:gap-4">
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
        <div class="w-full sm:w-1/3 z-10">
          <PVCard />
        </div>
        <div class="w-full sm:w-1/3 z-10">
          <SocCards />
        </div>
        <div class="w-full sm:w-1/3 flex items-center justify-center z-50">
          <DoughnutChart class="w-full h-full max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[200px]" />
        </div>
      </div>
      <BatteryStatus />
      <div class="flex flex-col">
        <div class="h-40 sm:h-48 md:h-56 lg:h-64 relative bottom-0 mx-1 sm:mx-2 md:mx-3 my-1 sm:my-2">
          <div class="absolute inset-0 flex items-center justify-center">
            <BarChart class="w-full" />
          </div>
        </div>
      </div>
    </div>

    <!-- 右側邊欄 -->
    <div class="w-full lg:w-2/12 flex flex-col bg-white/40 rounded-2xl p-2 sm:p-3 md:p-4 gap-2 sm:gap-3 md:gap-4">
      <div class="flex h-1/2 gap-2 sm:gap-3 md:gap-4">
        <StatsCards />
      </div>
      <div class="flex items-end h-1/2 p-2 sm:p-3 md:p-4">
        <Weather />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 添加響應式間距 */
@media (max-width: 640px) {
  .gap-2 {
    gap: 0.5rem;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .gap-3 {
    gap: 0.75rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .gap-4 {
    gap: 1rem;
  }
}

@media (min-width: 1025px) {
  .gap-4 {
    gap: 1.5rem;
  }
}

/* 添加響應式寬度 */
@media (max-width: 1024px) {
  .w-1\/3 {
    width: 100%;
  }
}

@media (min-width: 1025px) {
  .w-1\/3 {
    width: 33.333333%;
  }
}
</style>
