<script setup>
import { ref } from 'vue'

const props = defineProps({
  isLoading: Boolean,
})

const emit = defineEmits([
  'update-username',
  'update-email',
  'show-password-modal',
])

const newEmail = ref('')
const newUsername = ref('')

const handleUpdateUsername = () => {
  emit('update-username', newUsername.value)
  newUsername.value = ''
}

const handleUpdateEmail = () => {
  emit('update-email', newEmail.value)
  newEmail.value = ''
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-4">
    <h2
      class="text-lg font-bold text-emerald-800 mb-4 pb-2 border-b border-gray-200"
    >
      {{ $t('main.profile.update_information') }}
    </h2>

    <div class="space-y-4">
      <!-- 使用者名稱更新 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">{{
          $t('auth.user_name')
        }}</label>
        <div class="flex gap-2">
          <input
            type="text"
            v-model="newUsername"
            class="flex-1 px-3 py-2 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter new username"
          />
          <button
            class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 flex items-center gap-1"
            @click="handleUpdateUsername"
            :disabled="isLoading"
          >
            <svg
              v-if="isLoading"
              class="animate-spin h-4 w-4 mr-1"
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
            {{ $t('main.profile.update') }}
          </button>
        </div>
      </div>

      <!-- 電子郵件更新 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">{{
          $t('auth.email')
        }}</label>
        <div class="flex gap-2">
          <input
            type="email"
            v-model="newEmail"
            class="flex-1 px-3 py-2 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter new email"
          />
          <button
            class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 flex items-center gap-1"
            @click="handleUpdateEmail"
            :disabled="isLoading"
          >
            <svg
              v-if="isLoading"
              class="animate-spin h-4 w-4 mr-1"
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
            {{ $t('main.profile.update') }}
          </button>
        </div>
      </div>

      <!-- 密碼更新按鈕 -->
      <button
        class="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        @click="$emit('show-password-modal')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clip-rule="evenodd"
          />
        </svg>
        {{ $t('main.profile.update_password') }}
      </button>
    </div>
  </div>
</template>
