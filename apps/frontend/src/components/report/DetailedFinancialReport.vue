<script setup>
import { useI18n } from 'vue-i18n';
import { DownloadIcon, SunIcon, CloudIcon, CloudRainIcon, CloudSunIcon, AlertCircleIcon } from 'lucide-vue-next';
import { ref, computed } from 'vue';

const { t } = useI18n();
const errorMessage = ref('');
const isLoading = ref(false);

const props = defineProps({
  financialRecords: {
    type: Array,
    default: () => []
  }
});

// Computed property to handle and format data properly
const formattedRecords = computed(() => {
  try {
    return props.financialRecords.map(record => ({
      ...record,
      generation: typeof record.generation === 'number' ? record.generation.toFixed(2) : record.generation,
      price: typeof record.price === 'number' ? record.price.toFixed(2) : record.price,
      totalRevenue: typeof record.totalRevenue === 'number' ? record.totalRevenue : 0,
      storageUsage: typeof record.storageUsage === 'number' ? record.storageUsage.toFixed(2) : record.storageUsage,
      netRevenue: typeof record.netRevenue === 'number' ? record.netRevenue : 0,
      weather: record.weather || 'Unknown'
    }));
  } catch (error) {
    errorMessage.value = t('main.report.detailed_financial_report.data_format_error');
    console.error('Data formatting error:', error);
    return [];
  }
});

// Return corresponding icon based on weather
const getWeatherIcon = (weather) => {
  switch (weather) {
    case 'Sunny':
      return SunIcon;
    case 'Cloudy':
      return CloudIcon;
    case 'Rainy':
      return CloudRainIcon;
    case 'Partly Cloudy':
      return CloudSunIcon;
    default:
      return SunIcon;
  }
};

// Function to export data to Excel
const exportToExcel = () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    // Prepare the data for export
    const headers = [
      t('main.report.detailed_financial_report.date'),
      t('main.report.detailed_financial_report.generation_kwh'),
      t('main.report.detailed_financial_report.price'),
      t('main.report.detailed_financial_report.total_revenue'),
      t('main.report.detailed_financial_report.storage_usage_kwh'),
      t('main.report.detailed_financial_report.net_revenue'),
      t('main.report.detailed_financial_report.weather')
    ];
    
    // Convert records to array format for CSV
    const data = formattedRecords.value.map(record => [
      record.date,
      record.generation,
      `NT$ ${record.price}`,
      `NT$ ${record.totalRevenue.toLocaleString()}`,
      record.storageUsage,
      `NT$ ${record.netRevenue.toLocaleString()}`,
      record.weather
    ]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    data.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link and trigger the download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    errorMessage.value = t('main.report.detailed_financial_report.export_error');
    console.error('Export error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ t('main.report.detailed_financial_report.title') }}</h2>
      <button 
        class="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm flex items-center hover:bg-green-700 transition-colors"
        @click="exportToExcel"
        :disabled="isLoading || formattedRecords.length === 0"
      >
        <DownloadIcon class="w-4 h-4 mr-1" />
        {{ isLoading ? t('main.report.detailed_financial_report.exporting') : t('main.report.detailed_financial_report.export_excel') }}
      </button>
    </div>

    <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
      <AlertCircleIcon class="w-5 h-5 mr-2" />
      {{ errorMessage }}
    </div>

    <div v-if="formattedRecords.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center text-gray-500 dark:text-gray-400">
      {{ t('main.report.detailed_financial_report.no_data') }}
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('main.report.detailed_financial_report.date') }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('main.report.detailed_financial_report.generation_kwh') }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('main.report.detailed_financial_report.price') }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('main.report.detailed_financial_report.total_revenue') }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('main.report.detailed_financial_report.storage_usage_kwh') }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('main.report.detailed_financial_report.net_revenue') }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('main.report.detailed_financial_report.weather') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(record, index) in formattedRecords" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{{ record.date || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{{ record.generation || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">NT$ {{ record.price || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">NT$ {{ record.totalRevenue.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{{ record.storageUsage || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">NT$ {{ record.netRevenue.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                <div class="flex items-center">
                  <component :is="getWeatherIcon(record.weather)" class="w-4 h-4 mr-1" />
                  {{ record.weather }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        {{ t('main.report.detailed_financial_report.showing_entries', { start: 1, end: formattedRecords.length, total: formattedRecords.length }) }}
      </div>
    </div>
  </section>
</template> 