<script setup>
  import { ref } from 'vue';
  import { 
    SunIcon, 
    CalendarIcon, 
    DownloadIcon,
    // PercentIcon, // Moved to OperatingCostAnalysis
    // WalletIcon, // Moved to OperatingCostAnalysis
    // TrendingUpIcon, // Moved to KpiDashboard & OperatingCostAnalysis
    // TrendingDownIcon, // Moved to KpiDashboard & OperatingCostAnalysis
    // WrenchIcon // Moved to OperatingCostAnalysis & OptimizationSuggestions
  } from 'lucide-vue-next';
  import { useI18n } from 'vue-i18n';
  import KpiDashboard from './KpiDashboard.vue';
  import RevenueAnalytics from './RevenueAnalytics.vue';
  import DetailedFinancialReport from './DetailedFinancialReport.vue';
  import OptimizationSuggestions from './OptimizationSuggestions.vue';
  import OperatingCostAnalysis from './OperatingCostAnalysis.vue'; // Import the new component
  
  const { t } = useI18n();
  
  // Current month
  const currentMonth = ref('May 2025');
  
  // Dashboard data for KpiDashboard
  const dailyGeneration = ref('47944.739');
  const dailyGenerationIncrease = ref('12.5');
  const dailyRevenue = ref(2759699.205);
  const dailyRevenueIncrease = ref('14.2');
  const monthlyRevenue = ref(82790976.169);
  const targetAchievementRate = ref('87');
  const electricityPrice = ref('9.39');
  const roiPercentage = ref('22.5');
  const roiYears = ref('4.2');
  const roiImprovement = ref('6');
  
  // Financial records - Data will be passed to DetailedFinancialReport component
  const financialRecords = ref([
    {
      date: '2025/05/15',
      generation: '358.6 kWh',
      price: '4.8',
      totalRevenue: 2759699.205619999,
      storageUsage: '42.3 kWh',
      netRevenue: 14840,
      weather: 'Sunny'
    },
    {
      date: '2025/05/14',
      generation: '325.2 kWh',
      price: '4.8',
      totalRevenue: 14380,
      storageUsage: '38.6 kWh',
      netRevenue: 13520,
      weather: 'Sunny'
    },
    {
      date: '2025/05/13',
      generation: '287.4 kWh',
      price: '4.8',
      totalRevenue: 12680,
      storageUsage: '35.2 kWh',
      netRevenue: 11920,
      weather: 'Cloudy'
    },
    {
      date: '2025/05/12',
      generation: '198.6 kWh',
      price: '4.8',
      totalRevenue: 8760,
      storageUsage: '28.4 kWh',
      netRevenue: 8240,
      weather: 'Rainy'
    },
    {
      date: '2025/05/11',
      generation: '342.8 kWh',
      price: '4.8',
      totalRevenue: 15120,
      storageUsage: '40.5 kWh',
      netRevenue: 14180,
      weather: 'Sunny'
    },
    {
      date: '2025/05/10',
      generation: '312.5 kWh',
      price: '4.8',
      totalRevenue: 13780,
      storageUsage: '36.8 kWh',
      netRevenue: 12960,
      weather: 'Cloudy'
    },
    {
      date: '2025/05/09',
      generation: '348.2 kWh',
      price: '4.8',
      totalRevenue: 15320,
      storageUsage: '41.2 kWh',
      netRevenue: 14360,
      weather: 'Sunny'
    }
  ]);
  
  // Operating costs - Data will be passed to OperatingCostAnalysis component
  const operatingCost = ref(48500);
  const operatingCostDecrease = ref('5.2');
  const grossProfitPerKwh = ref('3.6');
  const grossMarginPercentage = ref('75');
  const netProfit = ref(294180);
  const netProfitIncrease = ref('8.7');
</script>
  
<template>
  <div class="min-h-screen">
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <SunIcon class="mr-2 text-yellow-500" />
          {{ t('main.report.header.title') }}
        </h1>
        <div class="flex items-center gap-4">
          <button class="text-sm px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md flex items-center">
            <CalendarIcon class="w-4 h-4 mr-1" />
            {{ currentMonth }}
          </button>
          <button class="text-sm px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-md flex items-center">
            <DownloadIcon class="w-4 h-4 mr-1" />
            {{ t('main.report.header.export_report') }}
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <KpiDashboard 
        :daily-generation="dailyGeneration"
        :daily-generation-increase="dailyGenerationIncrease"
        :daily-revenue="dailyRevenue"
        :daily-revenue-increase="dailyRevenueIncrease"
        :monthly-revenue="monthlyRevenue"
        :target-achievement-rate="targetAchievementRate"
        :electricity-price="electricityPrice"
        :roi-percentage="roiPercentage"
        :roi-years="roiYears"
        :roi-improvement="roiImprovement"
      />

      <RevenueAnalytics />

      <DetailedFinancialReport :financial-records="financialRecords" />

      <OptimizationSuggestions />

      <!-- Fifth Section: Operating Cost Analysis -->
      <OperatingCostAnalysis 
        :operating-cost="operatingCost"
        :operating-cost-decrease="operatingCostDecrease"
        :gross-profit-per-kwh="grossProfitPerKwh"
        :gross-margin-percentage="grossMarginPercentage"
        :net-profit="netProfit"
        :net-profit-increase="netProfitIncrease"
      />
    </main>
  </div>
</template>