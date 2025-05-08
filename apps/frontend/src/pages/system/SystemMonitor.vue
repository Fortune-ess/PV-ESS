<script setup>
import { computed, ref, watch } from 'vue'

const activeTab = ref('battery') // 預設顯示電池監控

const urls = {
  meter:
    'http://60.248.136.217:13000/d/8x2xVJ2nw/meter?orgId=1&refresh=5s&kiosk=tv&kios',
  powerControl:
    'http://60.248.136.217:13000/d/5fnBlbXnz/pcs?orgId=1&refresh=5s&kiosk=tv&kiosk',
  battery:
    'http://60.248.136.217:13000/d/15odcko7z/battery-monitor?orgId=1&refresh=5s&kiosk=tv&kios',
}

const url = computed(() => {
  return urls[activeTab.value]
})

const showIframe = ref(false)

const handleIframeLoad = () => {
  // 當 iframe 載入完成後，顯示內容
  setTimeout(() => {
    showIframe.value = true
  }, 200)
}

const changeTab = (tab) => {
  if (activeTab.value === tab) return

  // 切換頁籤時，先隱藏當前 iframe
  showIframe.value = false

  // 短暫延遲後再切換頁籤
  setTimeout(() => {
    activeTab.value = tab
  }, 100)
}

// 監聽 URL 變化，重置 iframe 顯示狀態
watch(
  () => url.value,
  () => {
    showIframe.value = false
  },
)
</script>

<template>
  <div class="flex flex-col min-h-screen w-full gap-2">
    <header class="shadow-md bg-white rounded-lg p-6">
      <div class="flex items-center justify-between">
        <h1 class="m-0 text-3xl font-bold text-gray-800">
          {{ $t('main.system.monitor.title') }}
        </h1>
        <div class="flex space-x-6">
          <button
            @click="changeTab('meter')"
            class="px-6 py-3 rounded-lg transition-all duration-300 shadow-sm"
            :class="
              activeTab === 'meter'
                ? 'bg-blue-200 text-gray-800 font-medium border border-gray-300'
                : 'bg-white hover:bg-blue-100 text-gray-800'
            "
          >
            {{ $t('main.system.monitor.meter') }}
          </button>
          <button
            @click="changeTab('powerControl')"
            class="px-6 py-3 rounded-lg transition-all duration-300 shadow-sm"
            :class="
              activeTab === 'powerControl'
                ? 'bg-blue-200 text-gray-800 font-medium border border-gray-300'
                : 'bg-white hover:bg-blue-100 text-gray-800'
            "
          >
            {{ $t('main.system.monitor.pcs') }}
          </button>
          <button
            @click="changeTab('battery')"
            class="px-6 py-3 rounded-lg transition-all duration-300 shadow-sm"
            :class="
              activeTab === 'battery'
                ? 'bg-blue-200 text-gray-800 font-medium border border-gray-300'
                : 'bg-white hover:bg-blue-100 text-gray-800'
            "
          >
            {{ $t('main.system.monitor.battery') }}
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 relative">
      <div
        class="w-full h-[calc(100vh-140px)] overflow-hidden rounded-lg shadow-md border border-gray-200"
      >
        <transition name="fade">
          <iframe
            v-show="showIframe"
            :src="url"
            class="w-full h-full border-none"
            @load="handleIframeLoad"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
