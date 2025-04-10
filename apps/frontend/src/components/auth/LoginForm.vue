<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const staySignedIn = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isNavigating = ref(false)
const cooldown = ref(0)
const showPassword = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const startCooldown = (seconds: number) => {
  cooldown.value = seconds
  localStorage.setItem(
    'loginCooldown',
    JSON.stringify({
      expiry: Date.now() + seconds * 1000,
    }),
  )

  const interval = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) {
      clearInterval(interval)
      localStorage.removeItem('loginCooldown')
    }
  }, 1000)
}

const handleSubmit = async () => {
  if (isLoading.value || cooldown.value > 0) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await authStore.login(email.value, password.value)

    await Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: res.data.message,
      timer: 1500,
      showConfirmButton: false,
    })

    isNavigating.value = true
    await router.push('/home')
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.data.retryAfter || 30
      errorMessage.value = `Too many requests. Please wait ${retryAfter} seconds.`
      startCooldown(retryAfter)
    } else {
      errorMessage.value = 'Login failed. Please check your credentials.'
    }

    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response.data.message,
      confirmButtonText: 'OK',
    })
  } finally {
    isLoading.value = false
  }
}

const checkStoredCooldown = () => {
  const storedCooldown = localStorage.getItem('loginCooldown')
  if (storedCooldown) {
    const cooldownData = JSON.parse(storedCooldown)
    const now = Date.now()
    const timeLeft = Math.ceil((cooldownData.expiry - now) / 1000)

    if (timeLeft > 0) {
      startCooldown(timeLeft)
    } else {
      localStorage.removeItem('loginCooldown')
    }
  }
}

onMounted(() => {
  checkStoredCooldown()
})
</script>

<template>
  <form class="w-full max-w-md" @submit.prevent="handleSubmit">
    <div class="relative mb-6">
      <input
        id="email"
        v-model="email"
        type="email"
        required
        autocomplete="user-email"
        class="textbox-input"
      />
      <label for="email" class="textbox-label">
        {{ $t('auth.email') }}
      </label>
    </div>

    <div class="relative mb-4">
      <div class="relative">
        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="current-password"
          class="textbox-input"
        />
        <label for="password" class="textbox-label">
          {{ $t('auth.password') }}
        </label>
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          @click="showPassword = !showPassword"
        >
          <svg
            v-if="showPassword"
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <svg
            v-else
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
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <input
          id="staySignedIn"
          v-model="staySignedIn"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label for="staySignedIn" class="ml-2 block text-sm text-gray-700">
          {{ $t('auth.stay_signed_in') }}
        </label>
      </div>
      <router-link
        to="/forgot-password"
        class="text-sm text-blue-600 hover:text-blue-500"
      >
        {{ $t('auth.forgot_password') }}
      </router-link>
    </div>

    <button
      type="submit"
      :disabled="isLoading || cooldown > 0"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        v-if="isLoading"
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
      <span>
        {{
          cooldown > 0
            ? $t('auth.cooldown', { time: cooldown })
            : isLoading
              ? $t('auth.loading')
              : $t('auth.sign_in')
        }}
      </span>
    </button>
  </form>

  <div
    v-if="isNavigating"
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl">
      <div class="flex flex-col items-center">
        <svg
          class="animate-spin h-8 w-8 text-blue-600 mb-4"
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
        <p class="text-gray-700">{{ $t('auth.loading') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.textbox-label,
.textbox-input {
  transition: 0.3s;
}

.textbox-label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translate(0, -50%);
  transform-origin: 0 50%;
  pointer-events: none;
  color: #ada5b4;
  font-size: 14px;
}

.textbox-input {
  width: 100%;
  padding: 10px 12px 0;
  background: #f4f1f7;
  outline: none;
  color: #2e2c2f;
  border: 0;
  border-radius: 8px;
  box-shadow: 0 0 0 2px transparent;
}

.textbox-input:focus {
  box-shadow: 0 0 0 2px #7b00f1;
}

.textbox-input:is(:focus, :not(:invalid)) ~ .textbox-label {
  scale: 0.725;
  transform: translate(0, -112%);
}
</style>
