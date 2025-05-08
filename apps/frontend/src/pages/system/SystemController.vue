<script setup>
import Swal from 'sweetalert2'
import { computed, nextTick, ref, watch } from 'vue'

// 狀態變數
const batteryEnabled = ref(false)
const pcsEnabled = ref(false)
const isFullscreen = ref(false)

// 切換 Battery
async function toggleBattery() {
  if (pcsEnabled.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Cannot close Battery',
      text: 'Please close Power Control System first.',
      confirmButtonText: 'OK',
    })
  } else {
    batteryEnabled.value = !batteryEnabled.value
  }
}

// 切換 Power Control System
async function togglePCS() {
  if (!batteryEnabled.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Cannot open Power Control System',
      text: 'Please open Battery first.',
      confirmButtonText: 'OK',
    })
  } else {
    pcsEnabled.value = !pcsEnabled.value
  }
}

// 根據當前狀態回傳對應圖片
const currentImage = computed(() => {
  if (batteryEnabled.value && pcsEnabled.value) return '/pcsStart.png'
  if (batteryEnabled.value) return '/bmsStart.png'
  return '/bmsStop.png'
})

// 用於 Transition 的 key
const currentImageKey = ref(0)
watch(currentImage, async () => {
  await nextTick()
  currentImageKey.value++
})

// 全螢幕開關
function openFullscreen() {
  isFullscreen.value = true
}
function closeFullscreen() {
  isFullscreen.value = false
}

// 按鈕樣式函式
function btnClass(active) {
  return [
    'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors duration-200',
    active
      ? 'bg-green-600 text-white hover:bg-green-700'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  ]
}
</script>

<template>
  <div class="h-full p-6 mx-auto">
    <div class="max-w-7xl mx-auto h-full flex flex-col gap-6">
      <!-- Header -->
      <header class="text-center">
        <h1 class="text-3xl font-bold text-gray-700">
          {{ $t('main.system.controller.title') }}
        </h1>
      </header>
      <!-- 主要內容：控制面板 + 顯示區 -->
      <div class="flex flex-col lg:flex-row gap-6 flex-1">
        <!-- 控制面板 -->
        <aside class="lg:w-1/3 flex flex-col gap-4">
          <button @click="toggleBattery" :class="btnClass(batteryEnabled)">
            <span>🔋</span>
            {{
              batteryEnabled
                ? $t('main.system.controller.battery_on')
                : $t('main.system.controller.battery_off')
            }}
          </button>
          <button @click="togglePCS" :class="btnClass(pcsEnabled)">
            <span>⚡</span>
            {{
              pcsEnabled
                ? $t('main.system.controller.power_on')
                : $t('main.system.controller.power_off')
            }}
          </button>
        </aside>
        <!-- 圖片顯示區 -->
        <section
          class="lg:w-2/3 bg-white rounded-lg shadow overflow-hidden p-4"
        >
          <transition name="fade" mode="out-in">
            <div
              :key="currentImageKey"
              class="relative w-full h-full flex items-center justify-center"
            >
              <img
                :src="currentImage"
                alt="System Status"
                class="max-w-full max-h-full object-contain"
              />
              <!-- 小一點的放大按鈕 -->
              <button
                @click="openFullscreen"
                class="absolute top-2 right-2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-1 text-gray-800 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4h6M4 4v6M20 20h-6M20 20v-6"
                  />
                </svg>
              </button>
            </div>
          </transition>
        </section>
      </div>
    </div>

    <!-- 全螢幕 Overlay -->
    <Teleport to="body">
      <div
        v-if="isFullscreen"
        class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50"
      >
        <button
          @click="closeFullscreen"
          class="absolute top-6 right-6 text-black hover:text-gray-600 transition-transform transform hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
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
          alt="Fullscreen"
          class="max-w-full max-h-full object-contain"
        />
      </div>
    </Teleport>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
