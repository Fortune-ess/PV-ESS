<script setup lang="ts">
import { useLanguage } from '@/lib/useLanguage'
import { useUserStore } from '@/store/user'
import { computed, onMounted, ref } from 'vue'

const userStore = useUserStore()
const { locale, changeLanguage } = useLanguage()

// 語言相關邏輯
type LanguageKey = 'en' | 'zh_TW' | 'zh_CN'
const currentLocale = computed(() => locale.value as LanguageKey)
const selectedLanguage = ref(currentLocale.value)
const isLanguageDropdownOpen = ref(false)

const languages: Record<LanguageKey, string> = {
  en: 'English',
  zh_TW: '繁體中文',
  zh_CN: '简体中文',
}

const selectLanguage = (lang: LanguageKey) => {
  selectedLanguage.value = lang
  changeLanguage(lang)
  isLanguageDropdownOpen.value = false
}

// 主題相關邏輯
type ThemeType = 'dark' | 'light' | 'system'
const selectedTheme = ref<ThemeType>('system')

const changeTheme = () => {
  const theme = selectedTheme.value

  if (theme === 'system') {
    // 使用系統主題
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } else {
    // 手動設定主題
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  localStorage.setItem('theme', theme)
}

onMounted(async () => {
  await userStore.fetchUser()

  // 初始化主題
  const savedTheme = localStorage.getItem('theme') as ThemeType | null
  if (savedTheme) {
    selectedTheme.value = savedTheme
    changeTheme()
  } else {
    // 如果沒有儲存的主題設定，預設使用系統主題
    selectedTheme.value = 'system'
    changeTheme()
  }
})
</script>

<template>
  <div
    v-if="userStore.user"
    class="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden relative h-96"
  >
    <!-- 標題區塊 -->
    <div class="bg-emerald-600 dark:bg-emerald-700 p-6">
      <h1 class="text-3xl font-bold text-white text-center">
        {{ $t('main.settings.title') }}
      </h1>
    </div>

    <!-- 設定內容區塊 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <!-- 語言設定卡片 -->
      <div
        class="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg"
      >
        <h2
          class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          {{ $t('main.settings.language') }}
        </h2>
        <div class="mt-4 relative z-10">
          <div
            class="w-full px-4 py-3 bg-white dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors flex justify-between items-center cursor-pointer"
            @click="isLanguageDropdownOpen = !isLanguageDropdownOpen"
          >
            <span>{{ languages[selectedLanguage] }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-transform"
              :class="{ 'transform rotate-180': isLanguageDropdownOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div
            v-if="isLanguageDropdownOpen"
            class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-600 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div
              v-for="(label, lang) in languages"
              :key="lang"
              class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
              @click="selectLanguage(lang as LanguageKey)"
            >
              {{ label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 載入中狀態 -->
  <div v-else class="flex flex-col items-center justify-center min-h-[60vh]">
    <div
      class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"
    ></div>
    <p class="text-lg text-gray-700 dark:text-gray-300 mt-4">
      {{ $t('main.loading') || '載入中...' }}
    </p>
  </div>
</template>
