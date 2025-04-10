<script setup lang="ts">
import { ref } from 'vue'
import FeatureCard from './FeatureCard.vue'

const monitoringIcon = ref(`
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
  />
`)

const analyticsIcon = ref(`
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
  />
`)

const schedulingIcon = ref(`
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
  />
`)

const systemMonitoringIcon = ref(`
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
  />
`)

const solarPanelIcon = ref(`
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
  />
`)

const energyStorageIcon = ref(`
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M13 10V3L4 14h7v7l9-11h-7z"
  />
`)

const energyConsumptionIcon = ref(`
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
  />
`)
</script>

<template>
  <!-- Entry Buttons Section -->
  <div class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2
          class="text-4xl font-bold text-gray-800 sm:text-5xl bg-clip-text bg-gradient-to-r from-[#b8f719] to-emerald-400"
        >
          {{ $t('home.features.monitoring.title') }}
        </h2>
        <p class="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          {{ $t('home.features.monitoring.description') }}
        </p>
      </div>
      <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          :icon="monitoringIcon"
          :title="$t('home.features.monitoring.title')"
          :description="$t('home.features.monitoring.description')"
          :button-text="$t('home.features.monitoring.button')"
        />
        <FeatureCard
          :icon="analyticsIcon"
          :title="$t('home.features.analytics.title')"
          :description="$t('home.features.analytics.description')"
          :button-text="$t('home.features.analytics.button')"
        />
        <FeatureCard
          :icon="schedulingIcon"
          :title="$t('home.features.scheduling.title')"
          :description="$t('home.features.scheduling.description')"
          :button-text="$t('home.features.scheduling.button')"
        />
        <FeatureCard
          :icon="systemMonitoringIcon"
          :title="$t('home.features.system_monitoring.title')"
          :description="$t('home.features.system_monitoring.description')"
          :button-text="$t('home.features.system_monitoring.button')"
        />
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <div class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-3">
        <FeatureCard
          :icon="solarPanelIcon"
          :title="$t('home.features.solar_panel.title')"
          :description="$t('home.features.solar_panel.description')"
        />
        <FeatureCard
          :icon="energyStorageIcon"
          :title="$t('home.features.energy_storage.title')"
          :description="$t('home.features.energy_storage.description')"
        />
        <FeatureCard
          :icon="energyConsumptionIcon"
          :title="$t('home.features.energy_consumption.title')"
          :description="$t('home.features.energy_consumption.description')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover {
  transform: translateY(-8px);
}
</style>
