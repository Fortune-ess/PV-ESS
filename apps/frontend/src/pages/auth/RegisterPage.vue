<script setup async>
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useAuthStore } from '@/store/auth'
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleSubmit = async () => {
  // Ensure passwords match
  if (password.value !== confirmPassword.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Password Mismatch',
      text: 'Passwords do not match.',
      confirmButtonText: 'OK',
    })
    return
  }

  isLoading.value = true
  try {
    // Call API to register
    const res = await authStore.register(
      username.value,
      email.value,
      password.value,
    )

    // Ensure API responds with a message
    if (res?.data?.message) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: res.data.message,
        timer: 1500,
        showConfirmButton: false,
      })
      await router.push('/login')
    }
  } catch (error) {
    // Safely parse error message
    const errorMessage = error.response?.data?.message || 'Something went wrong'
    await Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: errorMessage,
      confirmButtonText: 'OK',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    class="flex h-screen items-center justify-center bg-gray-50 overflow-hidden"
  >
    <div class="fixed bottom-4 right-4 z-50">
      <LanguageSwitcher direction="up" />
    </div>
    <div
      class="relative z-[2] bg-white rounded-lg p-12 w-[420px] flex flex-col items-center justify-center text-center shadow-md"
    >
      <img src="/logo01.png" class="w-40 mb-8" />
      <h2 class="text-2xl font-medium text-gray-800 mb-2">
        {{ $t('auth.create_account') }}
      </h2>
      <h3 class="text-sm text-gray-500 font-normal mb-8">
        {{ $t('auth.welcome_description') }}
      </h3>

      <form class="grid gap-4 w-full mb-6" @submit.prevent="handleSubmit">
        <div class="relative">
          <input
            id="username"
            v-model.trim="username"
            type="text"
            class="textbox-input"
            required
          />
          <label for="username" class="textbox-label">
            {{ $t('auth.user_name') }}
          </label>
        </div>

        <div class="relative">
          <input
            id="email"
            v-model.trim="email"
            type="email"
            class="textbox-input"
            required
          />
          <label for="email" class="textbox-label">
            {{ $t('auth.email') }}
          </label>
        </div>

        <div class="relative">
          <input
            id="password"
            v-model="password"
            type="password"
            class="textbox-input"
            required
          />
          <label for="password" class="textbox-label">
            {{ $t('auth.password') }}
          </label>
        </div>

        <div class="relative">
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="textbox-input"
            required
          />
          <label for="confirmPassword" class="textbox-label">
            {{ $t('auth.confirm_password') }}
          </label>
        </div>

        <div class="mb-6 flex items-center">
          <input
            id="agreeTerms"
            v-model="agreeTerms"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label for="agreeTerms" class="ml-2 text-sm text-gray-600">
            {{ $t('auth.terms_agreement') }}
            <router-link
              to="/terms-conditions"
              class="text-blue-600 hover:text-blue-800"
            >
              {{ $t('auth.terms_conditions') }}
            </router-link>
          </label>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 font-medium"
        >
          {{
            isLoading
              ? $t('auth.creating_account')
              : $t('auth.create_account_button')
          }}
        </button>
      </form>

      <p class="text-sm text-gray-500">
        {{ $t('auth.already_have_account') }}
        <router-link to="/login" class="text-blue-600 hover:text-blue-800">
          {{ $t('auth.sign_in_redirect') }}
        </router-link>
      </p>
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
