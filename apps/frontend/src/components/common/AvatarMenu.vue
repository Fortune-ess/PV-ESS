<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const isDropdownOpen = ref(false)

const handleSubmit = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    await authStore.logout()
    await Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: t('navbar.logout_success'),
      timer: 1500,
      showConfirmButton: false,
    })
    await router.push('/login')
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: (error as Error).message,
      confirmButtonText: 'OK',
    })
  } finally {
    isLoading.value = false
  }
}

let timeoutId: number | null = null

const handleMouseEnter = () => {
  if (timeoutId) {
    window.clearTimeout(timeoutId)
    timeoutId = null
  }
  isDropdownOpen.value = true
}

const handleAvatarLeave = () => {
  timeoutId = window.setTimeout(() => {
    isDropdownOpen.value = false
  }, 1000)
}

const handleDropdownLeave = () => {
  isDropdownOpen.value = false
}
</script>
<template>
  <div class="relative z-50">
    <button
      class="flex items-center text-white hover:text-green-100 focus:outline-none transition-transform duration-200 hover:scale-105"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleAvatarLeave"
    >
      <div
        class="w-8 h-8 rounded-full border border-black/20 bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    </button>
    <!-- 下拉選單 -->
    <div
      v-if="isDropdownOpen"
      v-cloak
      class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 transform transition-all duration-200 origin-top-right z-50"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleDropdownLeave"
    >
      <router-link
        to="/main/profile"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors duration-150"
      >
        {{ $t('navbar.profile') }}
      </router-link>
      <router-link
        to="/main/settings"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors duration-150"
      >
        {{ $t('navbar.settings') }}
      </router-link>
      <button
        :disabled="isLoading"
        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors duration-150"
        @click="handleSubmit"
      >
        <span v-if="isLoading" class="flex items-center">
          <svg
            class="animate-spin h-4 w-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ $t('navbar.logging_out') }}
        </span>
        <span v-else>{{ $t('navbar.logout') }}</span>
      </button>
    </div>
  </div>
</template>
