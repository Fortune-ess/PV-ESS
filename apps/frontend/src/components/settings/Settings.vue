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

const languages: Record<LanguageKey, string> = {
  en: 'English',
  zh_TW: '繁體中文',
  zh_CN: '简体中文',
}

const selectLanguage = () => {
  changeLanguage(selectedLanguage.value as LanguageKey)
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
    class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 bg-[#0a3726]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg"
  >
    <!-- 歡迎卡片 -->
    <div class="col-span-full p-4 md:p-6">
      <h1 class="text-2xl md:text-3xl font-bold text-emerald-100 text-center">
        {{ $t('main.settings.title') }}
      </h1>
    </div>

    <!-- 語言設定卡片 -->
    <div
      class="bg-[#0a3726]/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300"
    >
      <h2 class="text-lg md:text-xl font-semibold text-emerald-100 mb-4">
        {{ $t('main.settings.language') }}
      </h2>
      <div class="space-y-3">
        <select
          v-model="selectedLanguage"
          class="w-full px-4 py-2 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          @change="selectLanguage"
        >
          <option v-for="(label, lang) in languages" :key="lang" :value="lang">
            {{ label }}
          </option>
        </select>
      </div>
    </div>
  </div>

  <!-- 載入中狀態 -->
  <div v-else class="flex flex-col items-center justify-center min-h-[50vh]">
    <div
      class="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-4 border-emerald-300 border-t-transparent"
    ></div>
    <p class="text-base md:text-lg text-emerald-900 mt-4">載入中...</p>
  </div>
</template>
