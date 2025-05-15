<script setup>
import { useI18n } from 'vue-i18n';
import { WrenchIcon, PercentIcon, WalletIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-vue-next';

const { t } = useI18n();

defineProps({
  operatingCost: {
    type: Number,
    default: 0
  },
  operatingCostDecrease: {
    type: String,
    default: '0'
  },
  grossProfitPerKwh: {
    type: String,
    default: '0'
  },
  grossMarginPercentage: {
    type: String,
    default: '0'
  },
  netProfit: {
    type: Number,
    default: 0
  },
  netProfitIncrease: {
    type: String,
    default: '0'
  }
});

</script>

<template>
  <section>
    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{ t('main.report.operating_cost_analysis.title') }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('main.report.operating_cost_analysis.monthly_operating_cost') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">NT$ {{ operatingCost.toLocaleString() }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <TrendingDownIcon class="w-3 h-3 mr-1" />
              {{ t('main.report.operating_cost_analysis.compare_last_month') }} -{{ operatingCostDecrease }}%
            </p>
          </div>
          <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <WrenchIcon class="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('main.report.operating_cost_analysis.average_gross_profit_per_kwh') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">NT$ {{ grossProfitPerKwh }}</p>
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
              <PercentIcon class="w-3 h-3 mr-1" />
              {{ t('main.report.operating_cost_analysis.gross_margin_percentage', { percentage: grossMarginPercentage }) }}
            </p>
          </div>
          <div class="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
            <TrendingUpIcon class="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('main.report.operating_cost_analysis.monthly_net_profit') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">NT$ {{ netProfit.toLocaleString() }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <TrendingUpIcon class="w-3 h-3 mr-1" />
              {{ t('main.report.operating_cost_analysis.compare_last_month') }} +{{ netProfitIncrease }}%
            </p>
          </div>
          <div class="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
            <WalletIcon class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template> 