<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import Swal from 'sweetalert2'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const resetToken = ref((route.query.token as string) || '')
const loading = ref(false)

const showAlert = (title: string, text: string, icon: 'success' | 'error') => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: 'OK',
  })
}

onMounted(async () => {
  try {
    const res = await authStore.verifyResetToken(resetToken.value)
    await showAlert('Success!', res.data.message, 'success')
  } catch (error) {
    console.error('Error verifying token:', error)
    await showAlert(
      'Error!',
      'An error occurred while verifying the token.',
      'error',
    )
    await router.push('/forgot-password')
  }
})

const hasResetToken = computed(() => !!resetToken.value)

const handleSubmit = async () => {
  loading.value = true

  try {
    if (hasResetToken.value) {
      if (newPassword.value !== confirmPassword.value) {
        await showAlert('Error!', 'Passwords do not match!', 'error')
        return
      }

      const res = await authStore.resetPassword(
        resetToken.value,
        newPassword.value,
      )

      await showAlert('Success!', res.data.message, 'success')
      await router.push('/login')
    } else {
      await router.push('/forgot-password')
    }
  } catch (error) {
    console.error(error)
    await showAlert('Error!', 'An error occurred. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-50">
    <div
      class="relative z-[2] w-full max-w-md p-8 bg-white rounded-lg shadow-md"
    >
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">
          {{ $t('auth.welcome') }}
        </h1>
      </div>

      <h2 class="text-xl font-medium text-gray-700 mb-2">
        {{ $t('auth.reset_password') }}
      </h2>
      <p class="mb-6 text-sm text-gray-500">
        {{ $t('auth.reset_password_description') }}
      </p>

      <form @submit.prevent="handleSubmit">
        <div v-if="!hasResetToken">
          <div class="mb-6">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div v-else>
          <div class="mb-4">
            <label
              for="newPassword"
              class="block mb-2 text-sm font-medium text-gray-700"
              >{{ $t('auth.new_password') }}</label
            >
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div class="mb-6">
            <label
              for="confirmPassword"
              class="block mb-2 text-sm font-medium text-gray-700"
              >{{ $t('auth.confirm_new_password') }}</label
            >
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          :disabled="loading"
        >
          <span class="flex items-center justify-center">
            <svg
              v-if="loading"
              class="animate-spin h-5 w-5 mr-3"
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
            {{ $t('auth.reset_password') }}
          </span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{ $t('auth.remember_password') }}
        <router-link
          to="/login"
          class="text-blue-600 hover:text-blue-800 font-medium"
          >{{ $t('auth.back_to_login') }}</router-link
        >
      </p>
    </div>
  </div>
</template>
