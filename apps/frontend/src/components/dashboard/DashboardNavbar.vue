<script setup>
import weatherApi from '@/api/weatherApi'
import {
  Activity,
  Calendar,
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudRain,
  CloudSun,
  Headset,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sun,
  User,
  Wallet,
} from 'lucide-vue-next'
import { computed, defineEmits, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const emit = defineEmits(['toggle-sidebar'])
const currentTime = ref('')
const currentWeather = ref({
  weather: '',
  temperature: '',
})
const isSidebarOpen = ref(false)
const expandedSubmenu = ref('')

// 定時器引用
let timer = null

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  emit('toggle-sidebar')
}

const toggleSubmenu = (itemId) => {
  if (expandedSubmenu.value === itemId) {
    expandedSubmenu.value = ''
  } else {
    expandedSubmenu.value = itemId
  }
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 天氣圖標和顏色映射
const weatherConfig = {
  晴: { icon: Sun, color: 'text-yellow-400' },
  多雲: { icon: Cloud, color: 'text-gray-300' },
  陰: { icon: Cloud, color: 'text-gray-300' },
  雨: { icon: CloudRain, color: 'text-blue-400' },
  晴時多雲: { icon: CloudSun, color: 'text-yellow-300' },
}

// 獲取天氣圖標組件
const weatherIcon = computed(() => {
  const weather = currentWeather.value.weather
  return weatherConfig[weather]?.icon || Cloud
})

// 獲取天氣圖標顏色
const weatherIconColor = computed(() => {
  const weather = currentWeather.value.weather
  return weatherConfig[weather]?.color || 'text-gray-300'
})

const fetchWeatherData = async () => {
  try {
    const response = await weatherApi.getWeather()

    if (response.data.success) {
      const location = response.data.records.Locations[0].Location[0]

      // 獲取天氣現象和溫度數據
      const weatherData = location.WeatherElement.find(
        (el) => el.ElementName === '天氣現象',
      )
      const tempData = location.WeatherElement.find(
        (el) => el.ElementName === '溫度',
      )

      // 設置當前天氣
      if (weatherData && tempData) {
        currentWeather.value = {
          weather: weatherData.Time[0].ElementValue[0].Weather,
          temperature: `${tempData.Time[0].ElementValue[0].Temperature}°C`,
        }
      }
    }
  } catch (error) {
    console.error('獲取天氣數據失敗:', error)
  }
}

const menuItems = [
  {
    id: 'dashboard',
    lucideIcon: LayoutDashboard,
    link: '/main/dashboard',
  },
  {
    id: 'report',
    lucideIcon: Wallet,
    link: '/main/report',
  },
  {
    id: 'schedule',
    lucideIcon: Calendar,
    link: '/main/schedule',
  },
  {
    id: 'system-monitor',
    lucideIcon: Activity,
    hasSubmenu: true,
    submenu: [
      { id: 'system-monitor', link: '/main/system-monitor' },
      { id: 'system-controller', link: '/main/system-controller' },
    ],
  },
  {
    id: 'profile',
    lucideIcon: User,
    link: '/main/profile',
  },
  {
    id: 'settings',
    lucideIcon: Settings,
    link: '/main/settings',
  },
  {
    id: 'logout',
    lucideIcon: LogOut,
  },
]

const footerNavItems = [
  { name: 'Settings', icon: Settings, link: '/main/settings' },
  { name: 'Contact us', icon: Headset, link: '/contact' },
]

const navigateTo = (link) => {
  if (link) {
    router.push(link)
  }
  // Close any open submenu when navigating
  expandedSubmenu.value = ''
  if (isSidebarOpen.value) {
    toggleSidebar()
  }
}

onMounted(() => {
  updateTime()
  // 每秒更新一次時間，實現即時更新
  timer = setInterval(updateTime, 1000)

  // 獲取實際天氣數據
  fetchWeatherData()
})

// 組件銷毀前清除定時器
onBeforeUnmount(() => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <header class="p-2 flex items-center justify-between">
    <!-- Mobile Menu Button -->
    <button
      @click="toggleSidebar"
      class="lg:hidden p-2 rounded-md hover:bg-gray-100"
    >
      <Menu class="h-5 w-5 text-gray-500" />
    </button>

    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex items-center justify-center flex-1">
      <div class="flex items-center justify-between gap-6">
        <router-link to="/home" class="pl-0">
          <h2 class="text-xl font-semibold">PV ESS</h2>
        </router-link>
        <template v-for="item in menuItems" :key="item.id">
          <div v-if="item.hasSubmenu" class="relative">
            <button
              @click="toggleSubmenu(item.id)"
              class="flex items-center gap-2 p-2 text-black hover:text-gray-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-400 hover:after:w-full after:transition-all after:duration-300"
              :class="{
                'text-gray-600 after:w-full':
                  route.path.startsWith('/main/system'),
              }"
            >
              <component :is="item.lucideIcon" class="h-5 w-5" />
              <span>{{ item.id }}</span>
              <component
                :is="expandedSubmenu === item.id ? ChevronUp : ChevronDown"
                class="h-4 w-4"
              />
            </button>
            <div
              v-if="expandedSubmenu === item.id"
              class="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
            >
              <router-link
                v-for="subItem in item.submenu"
                :key="subItem.id"
                :to="subItem.link"
                class="flex items-center px-4 py-2 text-sm text-black hover:text-gray-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-400 hover:after:w-full after:transition-all after:duration-300"
                :class="{
                  'text-gray-600 after:w-full': route.path === subItem.link,
                }"
              >
                <span>{{ subItem.id }}</span>
              </router-link>
            </div>
          </div>
          <router-link
            v-else
            :to="item.link"
            class="flex items-center gap-2 p-2 text-black hover:text-gray-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-400 hover:after:w-full after:transition-all after:duration-300"
            :class="{ 'text-gray-600 after:w-full': route.path === item.link }"
            @click="expandedSubmenu = ''"
          >
            <component :is="item.lucideIcon" class="h-5 w-5" />
            <span>{{ item.id }}</span>
          </router-link>
        </template>
      </div>
    </nav>

    <!-- Mobile Sidebar -->
    <div v-if="isSidebarOpen" class="fixed inset-0 z-50 lg:hidden">
      <div class="fixed inset-0 bg-black/50" @click="toggleSidebar"></div>
      <div class="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg">
        <div class="p-4 border-b border-gray-200">
          <router-link to="/home">
            <h2 class="text-xl font-semibold">PV ESS</h2>
          </router-link>
        </div>
        <nav class="p-4">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.id">
              <div>
                <button
                  @click="
                    item.hasSubmenu
                      ? toggleSubmenu(item.id)
                      : navigateTo(item.link)
                  "
                  class="flex items-center w-full p-2 text-black hover:text-gray-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-400 hover:after:w-full after:transition-all after:duration-300"
                  :class="{
                    'text-gray-600 after:w-full':
                      route.path === item.link ||
                      (item.hasSubmenu &&
                        route.path.startsWith('/main/system')),
                  }"
                >
                  <component :is="item.lucideIcon" class="h-5 w-5 mr-3" />
                  <span>{{ item.id }}</span>
                  <component
                    v-if="item.hasSubmenu"
                    :is="expandedSubmenu === item.id ? ChevronUp : ChevronDown"
                    class="h-4 w-4 ml-auto"
                  />
                </button>
                <div
                  v-if="item.hasSubmenu && expandedSubmenu === item.id"
                  class="ml-8 mt-1 space-y-1"
                >
                  <button
                    v-for="subItem in item.submenu"
                    :key="subItem.id"
                    @click="navigateTo(subItem.link)"
                    class="flex items-center w-full p-2 text-black hover:text-gray-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-400 hover:after:w-full after:transition-all after:duration-300"
                    :class="{
                      'text-gray-600 after:w-full': route.path === subItem.link,
                    }"
                  >
                    <span>{{ subItem.id }}</span>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        <div class="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <ul class="flex justify-around">
            <li v-for="item in footerNavItems" :key="item.name">
              <button
                @click="navigateTo(item.link)"
                class="flex flex-col items-center p-2 text-black hover:text-gray-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-400 hover:after:w-full after:transition-all after:duration-300"
                :class="{
                  'text-gray-600 after:w-full': route.path === item.link,
                }"
              >
                <component :is="item.icon" class="h-5 w-5 mb-1" />
                <span class="text-xs">{{ item.name }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-8 min-w-[200px] justify-end">
      <!-- Weather Info -->
      <div class="flex items-center gap-4 text-gray-600 min-w-[180px]">
        <div class="text-sm w-[100px] text-right">
          {{ currentTime }}
        </div>
        <div class="flex items-center gap-2 min-w-[100px]">
          <component
            v-if="currentWeather.weather"
            :is="weatherIcon"
            class="h-5 w-5"
            :class="weatherIconColor"
          />
          <span class="min-w-[50px]">{{ currentWeather.temperature }}</span>
        </div>
      </div>
    </div>
  </header>
</template>
