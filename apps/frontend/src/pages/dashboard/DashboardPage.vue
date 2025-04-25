<script setup lang="ts">
import BarChart from '@/components/dashboard/BarChart.vue'
import BatteryStatus from '@/components/dashboard/dashboard/BatteryStatus.vue'
import SocCards from '@/components/dashboard/dashboard/SocCards.vue'
import StatsCards from '@/components/dashboard/dashboard/StatsCards.vue'
import DoughnutChart from '@/components/dashboard/DoughnutChart.vue'
import RealTimeChart from '@/components/dashboard/RealTimeChart.vue'
import TheSystem from '@/components/dashboard/TheSystem.vue'
import Weather from '@/components/dashboard/Weather.vue'

</script>

<template>
  <div class="flex flex-col lg:flex-row gap-4">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col gap-4">
      <!-- Top Section -->
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- 系統監控區域 -->
        <div class="flex-1 bg-white/40 rounded-2xl p-4">
          <h1
            class="text-base md:text-xl font-medium mb-4 text-black flex items-center"
          >
            <span class="mr-2">{{
              $t('main.dashboard.real_time_monitoring')
            }}</span>
          </h1>
          <TheSystem />

          <div class="rounded-2xl">
            <div class="flex flex-col gap-4">
              <RealTimeChart />
            </div>
          </div>
        </div>

        <!-- 右側圓餅圖 -->
        <div class="flex-1 flex flex-col bg-white/40 rounded-2xl p-6 gap-4">
          <div class="flex md:flex-row flex-col gap-4">
            <div class="w-full md:w-1/2">
              <SocCards />
            </div>
            <div class="w-full md:w-1/2 flex items-center justify-center">
              <DoughnutChart class="w-full h-full max-w-[200px]" />
            </div>
          </div>
          <BatteryStatus />
          <div class="flex flex-col">
            <div class="h-64 relative bottom-0 mx-4 my-2">
              <div class="absolute inset-0 flex items-center justify-center">
                <BarChart class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="lg:w-72 flex flex-col gap-4 bg-white/40 backdrop-blur-[30px]">
      <StatsCards />
      <div class="rounded-2xl p-4">
        <Weather />
      </div>
    </div>
  </div>
</template>
