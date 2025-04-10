<script setup>
import Swal from 'sweetalert2'
import { computed, nextTick, ref, watch } from 'vue'

const batteryEnabled = ref(false) // Battery 初始關閉
const pcsEnabled = ref(false) // Power Control System 初始關閉
const isFullscreen = ref(false) // 全螢幕狀態

// 切換 Battery 狀態
const toggleBattery = async () => {
  if (pcsEnabled.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Can not close Battery',
      text: 'Please close Power Control System first, then Battery button can close.',
      confirmButtonText: 'Confirm',
    })
  } else {
    batteryEnabled.value = !batteryEnabled.value
  }
}

// 切換 Power Control System 狀態
const togglePCS = async () => {
  if (!batteryEnabled.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Can not open Power Control System',
      text: 'Please open Battery first, then open Power Control System.',
      confirmButtonText: 'Confirm',
    })
  } else {
    pcsEnabled.value = !pcsEnabled.value
  }
}

// 計算當前應顯示的圖片
const currentImage = computed(() => {
  if (batteryEnabled.value && pcsEnabled.value) {
    return '/pcsStart.png'
  } else if (batteryEnabled.value && !pcsEnabled.value) {
    return '/bmsStart.png'
  } else {
    return '/bmsStop.png'
  }
})

// 確保 `<Transition>` 正確觸發動畫
const currentImageKey = ref(0)
watch(currentImage, async () => {
  await nextTick() // 確保 DOM 更新後才觸發動畫
  currentImageKey.value += 1
})

const openFullscreen = () => {
  isFullscreen.value = true
}

// 關閉全螢幕
const closeFullscreen = () => {
  isFullscreen.value = false
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- 開關按鈕 -->
    <div class="flex flex-col md:flex-row justify-center gap-4 mb-4 mx-auto">
      <!-- Battery 按鈕 -->
      <button
        @click="toggleBattery"
        :class="[
          'px-12 py-4 sm:px-6 sm:py-2 rounded-lg transition-all',
          batteryEnabled
            ? 'bg-green-800/70 text-white'
            : 'bg-gray-300 text-gray-700',
        ]"
      >
        Battery: {{ batteryEnabled ? 'ON' : 'OFF' }}
      </button>

      <!-- Power Control System 按鈕 -->
      <button
        @click="togglePCS"
        :class="[
          'px-12 py-4 sm:px-6 sm:py-2 rounded-lg transition-all',
          pcsEnabled
            ? 'bg-green-800/70 text-white'
            : 'bg-gray-300 text-gray-700',
        ]"
      >
        Power Control System: {{ pcsEnabled ? 'ON' : 'OFF' }}
      </button>
    </div>

    <!-- 圖片顯示區 -->
    <div class="flex-1 p-4 flex justify-center items-center">
      <div
        class="w-full md:w-3/4 md:h-auto bg-white/80 rounded-lg shadow-md overflow-hidden flex justify-center items-center"
      >
        <transition name="fade" mode="out-in">
          <img
            v-if="currentImage"
            :key="currentImageKey"
            :src="currentImage"
            alt="System Status"
            class="w-full h-full object-contain transition-opacity duration-500 ease-in-out"
            @click="openFullscreen"
          />
        </transition>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="isFullscreen"
      class="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50"
    >
      <button
        class="absolute top-4 right-4 text-gray-700 hover:bg-white/10 hover:scale-110 transition-all duration-300"
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
  </Teleport>
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
