<script setup>
import { computed, ref } from 'vue'

const currentSelection = ref('meter') // 初始選擇為 Meter
const isFullscreen = ref(false) // 全螢幕狀態

// 切換選擇
const selectMeter = () => {
  currentSelection.value = 'meter'
}

const selectPCS = () => {
  currentSelection.value = 'pcs'
}

const selectBattery = () => {
  currentSelection.value = 'battery'
}

// 計算當前應顯示的圖片
const currentImage = computed(() => {
  if (currentSelection.value === 'meter') {
    return '/meterImage.png'
  } else if (currentSelection.value === 'pcs') {
    return '/pcsStart.png'
  } else if (currentSelection.value === 'battery') {
    return '/bmsStart.png'
  } else {
    return '/bmsStop.png'
  }
})

// 開啟全螢幕
const openFullscreen = () => {
  isFullscreen.value = true
}

// 關閉全螢幕
const closeFullscreen = () => {
  isFullscreen.value = false
}
</script>

<template>
  <div class="relative flex flex-col h-full">
    <!-- 開關按鈕 -->
    <div class="flex flex-col sm:flex-row mx-auto justify-center gap-4 mb-4">
      <!-- Meter 按鈕 -->
      <button
        @click="selectMeter"
        :class="[
          'px-12 py-4 sm:px-6 sm:py-2 rounded-lg transition-all',
          currentSelection === 'meter'
            ? 'bg-green-800/70 text-white'
            : 'bg-gray-300 text-gray-700',
        ]"
      >
        Meter
      </button>

      <!-- Power Control System 按鈕 -->
      <button
        @click="selectPCS"
        :class="[
          'px-12 py-4 sm:px-6 sm:py-2 rounded-lg transition-all',
          currentSelection === 'pcs'
            ? 'bg-green-800/70 text-white'
            : 'bg-gray-300 text-gray-700',
        ]"
      >
        Power Control System
      </button>

      <!-- Battery 按鈕 -->
      <button
        @click="selectBattery"
        :class="[
          'px-12 py-4 sm:px-6 sm:py-2 rounded-lg transition-all',
          currentSelection === 'battery'
            ? 'bg-green-800/70 text-white'
            : 'bg-gray-300 text-gray-700',
        ]"
      >
        Battery
      </button>
    </div>

    <!-- 下半部 - 圖片顯示 -->
    <div class="flex-1 p-4 mt-4 flex justify-center items-center">
      <div
        class="w-full md:w-3/4 md:h-auto bg-white/80 rounded-lg shadow-md overflow-hidden flex justify-center items-center"
      >
        <transition name="fade" mode="out-in">
          <img
            :key="currentImage"
            :src="currentImage"
            alt="System Status"
            class="w-full h-full object-contain transition-opacity duration-500 ease-in-out cursor-pointer"
            @click="openFullscreen"
          />
        </transition>
      </div>
    </div>

    <!-- 全螢幕顯示 -->
    <div
      v-if="isFullscreen"
      class="fixed top-20 bottom-20 right-20 left-20 rounded-2xl inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50"
    >
      <button
        class="absolute top-4 right-4 text-gray-700 hover:bg-white/10 hover:scale-110 hover:transition-all hover:duration-300"
        @click="closeFullscreen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <img
        :src="currentImage"
        alt="Fullscreen Image"
        class="max-w-full max-h-full object-contain"
      />
    </div>
  </div>
</template>

<style>
/* Vue 內建的 Transition 樣式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
