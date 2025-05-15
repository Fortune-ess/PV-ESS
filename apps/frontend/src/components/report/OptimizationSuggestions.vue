<script setup>
import { useI18n } from 'vue-i18n';
import { BrainIcon, BarChart2Icon, WrenchIcon } from 'lucide-vue-next';

const { t } = useI18n();

// No props needed for this component based on its current structure

</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{ t('main.report.optimization_suggestions.title') }}</h2>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div class="flex items-start space-x-3 mb-4">
        <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <BrainIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ t('main.report.optimization_suggestions.smart_discharge_title') }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ t('main.report.optimization_suggestions.smart_discharge_description') }}</p>
        </div>
      </div>

      <div class="flex items-start space-x-3 mb-4">
        <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <BarChart2Icon class="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ t('main.report.optimization_suggestions.performance_evaluation_title') }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ t('main.report.optimization_suggestions.performance_evaluation_description') }}</p>
        </div>
      </div>

      <div class="flex items-start space-x-3">
        <div class="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
          <WrenchIcon class="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ t('main.report.optimization_suggestions.maintenance_alert_title') }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ t('main.report.optimization_suggestions.maintenance_alert_description') }}</p>
        </div>
      </div>
    </div>
  </section>
</template> 