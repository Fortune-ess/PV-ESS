<script setup>
import {
  DollarSignIcon,
  ZapIcon,
  BarChartIcon,
  TagIcon,
  TargetIcon,
  InfoIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  CalculatorIcon
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Props to receive data from the parent component
defineProps({
  dailyGeneration: { type: String, default: '0' },
  dailyGenerationIncrease: { type: String, default: '0' },
  dailyRevenue: { type: Number, default: 0 },
  dailyRevenueIncrease: { type: String, default: '0' },
  monthlyRevenue: { type: Number, default: 0 },
  targetAchievementRate: { type: String, default: '0' },
  electricityPrice: { type: String, default: '0' },
  roiPercentage: { type: String, default: '0' },
  roiYears: { type: String, default: '0' },
  roiImprovement: { type: String, default: '0' },
});

</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{ t('main.report.kpi_dashboard.title') }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Daily Generation -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('main.dashboard.today_generation_degree') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ dailyGeneration }} kWh</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <TrendingUpIcon class="w-3 h-3 mr-1" />
              {{ t('main.report.kpi_dashboard.compare_yesterday') }} +{{ dailyGenerationIncrease }}%
            </p>
          </div>
          <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <ZapIcon class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      <!-- Today's Revenue -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('main.dashboard.today_accumulated_income') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">NT$ {{ dailyRevenue.toLocaleString() }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <TrendingUpIcon class="w-3 h-3 mr-1" />
              {{ t('main.report.kpi_dashboard.compare_yesterday') }} +{{ dailyRevenueIncrease }}%
            </p>
          </div>
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <DollarSignIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <!-- Monthly Accumulated Revenue -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('main.dashboard.this_month_accumulated_income') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">NT$ {{ monthlyRevenue.toLocaleString() }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <TargetIcon class="w-3 h-3 mr-1" />
              {{ t('main.report.kpi_dashboard.target_achievement_rate') }} {{ targetAchievementRate }}%
            </p>
          </div>
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <BarChartIcon class="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <!-- Electricity Sales Price -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('main.report.kpi_dashboard.electricity_sales_price') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">NT$ {{ electricityPrice }} / kWh</p>
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
              <InfoIcon class="w-3 h-3 mr-1" />
              {{ t('main.report.kpi_dashboard.taipower_contract_price') }}
            </p>
          </div>
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <TagIcon class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <!-- Monthly ROI Progress -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('main.report.kpi_dashboard.monthly_roi_progress') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ roiPercentage }}%</p>
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
              <CalendarIcon class="w-3 h-3 mr-1" />
              {{ t('main.report.kpi_dashboard.accumulated_roi') }}
            </p>
          </div>
          <div class="relative w-16 h-16">
            <!-- ROI Circle -->
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3" />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#3b82f6"
                stroke-width="3"
                :stroke-dasharray="`${parseFloat(roiPercentage) * 0.942}, 94.2`"
                stroke-dashoffset="0"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
              {{ roiPercentage }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Investment Recovery Period Estimate -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('main.report.kpi_dashboard.investment_recovery_period') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ roiYears }} {{ t('main.report.kpi_dashboard.shortened_by_months', { months: '' }) }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <TrendingDownIcon class="w-3 h-3 mr-1" />
              {{ t('main.report.kpi_dashboard.shortened_by_months', { months: roiImprovement }) }}
            </p>
          </div>
          <div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <CalculatorIcon class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template> 