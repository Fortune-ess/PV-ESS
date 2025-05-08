<script setup>
import { ref } from 'vue'

const props = defineProps({
  isLoading: Boolean,
  show: Boolean,
})

const emit = defineEmits(['close', 'update-password'])

const oldPassword = ref('')
const newPassword = ref('')
const showOldPassword = ref(false)
const showNewPassword = ref(false)

const handleUpdatePassword = () => {
  emit('update-password', {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
  })
  oldPassword.value = ''
  newPassword.value = ''
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>
    <div class="relative bg-white rounded-xl p-4 w-full max-w-md shadow-2xl">
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="$emit('close')"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      <h3 class="text-lg font-bold mb-4 text-emerald-800">
        {{ $t('main.profile.update_password') }}
      </h3>

      <!-- Password Form Content -->
      <div class="space-y-4">
        <!-- Old Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('main.profile.old_password') }}
          </label>
          <div class="relative">
            <input
              :type="showOldPassword ? 'text' : 'password'"
              v-model="oldPassword"
              class="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              @click="showOldPassword = !showOldPassword"
            >
              <!-- Eye Icons -->
              <svg
                class="h-5 w-5 text-gray-500"
                :class="showOldPassword ? 'block' : 'hidden'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                class="h-5 w-5 text-gray-500"
                :class="showOldPassword ? 'hidden' : 'block'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clip-rule="evenodd"
                />
                <path
                  d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('main.profile.new_password') }}
          </label>
          <div class="relative">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              v-model="newPassword"
              class="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              @click="showNewPassword = !showNewPassword"
            >
              <!-- Eye Icons -->
              <svg
                class="h-5 w-5 text-gray-500"
                :class="showNewPassword ? 'block' : 'hidden'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                class="h-5 w-5 text-gray-500"
                :class="showNewPassword ? 'hidden' : 'block'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clip-rule="evenodd"
                />
                <path
                  d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                />
              </svg>
            </button>
          </div>
        </div>

        <button
          class="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center"
          :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
          :disabled="isLoading"
          @click="handleUpdatePassword"
        >
          <span v-if="!isLoading">{{ $t('main.profile.confirm_update') }}</span>
          <div
            v-else
            class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
          ></div>
        </button>

        <router-link
          to="/forgot-password"
          class="block text-center text-sm text-emerald-600 hover:text-emerald-800 hover:underline transition-colors duration-300"
        >
          {{ $t('auth.forgot_password') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
