<script setup>
import { useAuthStore } from '@/store/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleSubmit = async () => {
  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const res = await authStore.forgotPassword(email.value)

    if (res.data?.success) {
      successMessage.value =
        'Password reset link sent successfully! Please check your email.'
      setTimeout(async () => {
        await router.push('/reset-password')
      }, 2000)
    } else {
      errorMessage.value = 'Failed to send reset link. Please try again.'
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      'An error occurred. Please try again later.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-50">
    <div
      class="relative z-[2] w-full max-w-sm p-8 bg-white rounded-lg shadow-md"
    >
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">PV-ESS</h1>
      </div>

      <h2 class="text-xl font-medium text-gray-700 mb-2">
        {{ $t('auth.forgot_password') }}
      </h2>
      <p class="mb-6 text-sm text-gray-500">
        {{ $t('auth.enter_email_to_reset') }}
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="mb-6">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-700"
          >
            {{ $t('auth.email') }}
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autocomplete="email"
          />
        </div>

        <!-- Success and Error Messages -->
        <p v-if="successMessage" class="text-blue-600 text-sm text-center mb-4">
          {{ successMessage }}
        </p>
        <p v-if="errorMessage" class="text-red-500 text-sm text-center mb-4">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="w-full flex items-center justify-center bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          :disabled="isLoading"
        >
          <svg
            v-if="isLoading"
            class="animate-spin h-5 w-5 mr-3 text-white"
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
          {{
            isLoading
              ? $t('auth.sending_reset_link')
              : $t('auth.send_reset_link')
          }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{ $t('auth.remember_password') }}
        <router-link
          to="/login"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          {{ $t('auth.back_to_login') }}
        </router-link>
      </p>
    </div>
  </div>
</template>
