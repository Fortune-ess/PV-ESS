import en from '@/locales/en.json'
import { createI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/naming-convention
import zh_TW from '@/locales/zh-TW.json'
// eslint-disable-next-line @typescript-eslint/naming-convention
import zh_CN from '@/locales/zh-CN.json'

const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: localStorage.getItem('lang') || 'en', // 預設語言
  fallbackLocale: 'en',
  messages: {
    en: en,
    zh_TW: zh_TW,
    zh_CN: zh_CN,
  },
})

export default i18n
