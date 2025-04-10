<script setup>
import { useAuthStore } from '@/store/auth'
import { useUserStore } from '@/store/user'
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const showPasswordModal = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const isLoading = ref(false)
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const newEmail = ref('')
const newUsername = ref('')

const handleDeleteUser = async () => {
  const result = await Swal.fire({
    title: '確認刪除帳號?',
    text: '此操作無法復原!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: '是的,刪除帳號',
    cancelButtonText: '取消',
  })

  if (result.isConfirmed) {
    try {
      isLoading.value = true
      await userStore.deleteUser()
      await Swal.fire({
        icon: 'success',
        title: '成功',
        text: '帳號已刪除',
      })
      await authStore.logout()
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: error.message || '刪除帳號失敗，請稍後再試',
      })
    } finally {
      isLoading.value = false
    }
  }
}

const handleUpdatePassword = async () => {
  if (!oldPassword.value || !newPassword.value) {
    await Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '請填寫完整密碼資訊',
    })
    return
  }

  try {
    isLoading.value = true
    await userStore.updatePassword(oldPassword.value, newPassword.value)

    showPasswordModal.value = false
    oldPassword.value = ''
    newPassword.value = ''

    await Swal.fire({
      icon: 'success',
      title: '成功',
      text: '密碼已更新成功，請重新登入',
    })
    await authStore.logout()
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: error.message || '密碼更新失敗，請稍後再試',
    })
  } finally {
    isLoading.value = false
  }
}

const handleUpdateEmail = async () => {
  if (!newEmail.value) {
    await Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '請填寫新的電子郵件地址',
    })
    return
  }

  try {
    isLoading.value = true
    await userStore.updateEmail(newEmail.value)

    await Swal.fire({
      icon: 'success',
      title: '成功',
      text: '電子郵件已更新成功',
    })

    await userStore.fetchUser()
    newEmail.value = ''
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: error.message || '電子郵件更新失敗，請稍後再試',
    })
  } finally {
    isLoading.value = false
  }
}

const handleUpdateUsername = async () => {
  if (!newUsername.value) {
    await Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '請填寫新的使用者名稱',
    })
    return
  }

  try {
    isLoading.value = true
    await userStore.updateUsername(newUsername.value)

    await Swal.fire({
      icon: 'success',
      title: '成功',
      text: '使用者名稱已更新成功',
    })

    await userStore.fetchUser()
    newUsername.value = ''
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: error.message || '使用者名稱更新失敗，請稍後再試',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await userStore.fetchUser()
})
</script>

<template>
  <div
    v-if="userStore.user"
    class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 p-6 rounded-lg shadow-lg"
  >
    <!-- 歡迎卡片 -->
    <div class="col-span-full p-4 md:p-6">
      <h1 class="text-2xl md:text-3xl font-bold text-emerald-800 text-center">
        {{ $t('main.profile.title') }}
      </h1>
    </div>

    <!-- 用戶資訊卡片 -->
    <div
      class="bg-[#0a3726]/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300"
    >
      <h2 class="text-lg md:text-xl font-semibold text-emerald-100 mb-4">
        {{ $t('main.profile.information') }}
      </h2>
      <div class="space-y-3 md:space-y-4">
        <div class="flex justify-between">
          <span class="text-sm md:text-base text-emerald-100">{{
            $t('auth.user_name')
          }}</span>
          <span class="text-sm md:text-base text-emerald-100">{{
            userStore.user.data.username
          }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm md:text-base text-emerald-100">{{
            $t('auth.email')
          }}</span>
          <span class="text-sm md:text-base text-emerald-100 break-all">{{
            userStore.user.data.email
          }}</span>
        </div>
        <button
          @click="handleDeleteUser"
          class="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 shadow-lg"
          :disabled="isLoading"
        >
          Delete Account
        </button>
      </div>
    </div>

    <!-- 時間資訊卡片 -->
    <div
      class="bg-[#0a3726]/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300"
    >
      <h2 class="text-lg md:text-xl font-semibold text-emerald-100 mb-4">
        {{ $t('main.profile.time_information') }}
      </h2>
      <div class="flex justify-between">
        <span class="text-sm md:text-base text-emerald-100">{{
          $t('main.profile.join_date')
        }}</span>
        <span class="text-sm md:text-base text-emerald-100">{{
          new Date(userStore.user.data.createdAt).toLocaleString()
        }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm md:text-base text-emerald-100">{{
          $t('main.profile.update_date')
        }}</span>
        <span class="text-sm md:text-base text-emerald-100">{{
          new Date(userStore.user.data.updatedAt).toLocaleString()
        }}</span>
      </div>
    </div>

    <!-- 更新資訊卡片 -->
    <div
      class="bg-[#0a3726]/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300"
    >
      <h2 class="text-lg md:text-xl font-semibold text-emerald-100 mb-4">
        {{ $t('main.profile.update_information') }}
      </h2>
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm text-emerald-100">{{
            $t('auth.user_name')
          }}</label>
          <div class="flex gap-2">
            <input
              type="text"
              v-model="newUsername"
              class="w-full px-4 py-2 bg-[#0a3726]/80 text-white rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              class="px-4 py-2 bg-[#0a3726]/80 hover:bg-emerald-700 text-emerald-100 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-600/20"
              @click="handleUpdateUsername"
              :disabled="isLoading"
            >
              {{ $t('main.profile.update') }}
            </button>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm text-emerald-100">{{ $t('auth.email') }}</label>
          <div class="flex gap-2">
            <input
              type="email"
              v-model="newEmail"
              class="w-full px-4 py-2 bg-[#0a3726]/80 text-white rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              class="px-4 py-2 bg-[#0a3726]/80 hover:bg-emerald-700 text-emerald-100 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-600/20"
              @click="handleUpdateEmail"
              :disabled="isLoading"
            >
              {{ $t('main.profile.update') }}
            </button>
          </div>
          <button
            class="w-full px-4 py-2 bg-[#0a3726]/80 hover:bg-emerald-700 text-emerald-100 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-600/20"
            @click="showPasswordModal = true"
          >
            {{ $t('main.profile.update_password') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 載入中狀態 -->
  <div v-else class="flex flex-col items-center justify-center min-h-[50vh]">
    <div
      class="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-4 border-emerald-300 border-t-transparent"
    ></div>
    <p class="text-base md:text-lg text-emerald-100 mt-4">
      {{ $t('main.profile.loading') }}
    </p>
  </div>

  <!-- 修改密碼彈窗 -->
  <div
    v-if="showPasswordModal"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div
      class="absolute inset-0 bg-emerald-900/30 backdrop-blur-sm"
      @click="showPasswordModal = false"
    ></div>
    <div
      class="relative bg-[#0a3726]/80 backdrop-blur-sm rounded-lg p-6 w-full max-w-md border border-emerald-200 shadow-2xl"
    >
      <button
        class="absolute top-4 right-4 text-emerald-100 hover:text-emerald-700 hover:scale-105 duration-300"
        @click="showPasswordModal = false"
      >
        <svg
          class="w-6 h-6"
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

      <h3 class="text-xl font-semibold mb-4 text-emerald-100">
        {{ $t('main.profile.update_password') }}
      </h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-emerald-100 mb-1">{{
            $t('main.profile.old_password')
          }}</label>
          <div class="relative">
            <input
              :type="showOldPassword ? 'text' : 'password'"
              v-model="oldPassword"
              class="w-full px-3 py-2 bg-[#0a3726]/80 text-white border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              @click="showOldPassword = !showOldPassword"
            >
              <svg
                class="h-5 w-5 text-emerald-100"
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
                class="h-5 w-5 text-emerald-100"
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

        <div>
          <label class="block text-sm font-medium text-emerald-100 mb-1">{{
            $t('main.profile.new_password')
          }}</label>
          <div class="relative">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              v-model="newPassword"
              class="w-full px-3 py-2 bg-[#0a3726]/80 text-white border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              @click="showNewPassword = !showNewPassword"
            >
              <svg
                class="h-5 w-5 text-emerald-100"
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
                class="h-5 w-5 text-emerald-100"
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
          class="w-full px-4 py-2 bg-[#0a3726]/80 hover:bg-emerald-700 text-emerald-100 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg shadow-emerald-600/20"
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
          class="block text-center text-emerald-100 hover:text-emerald-100 hover:underline transition-colors duration-300"
          >{{ $t('auth.forgot_password') }}</router-link
        >
      </div>
    </div>
  </div>
</template>
