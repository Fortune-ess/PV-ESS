<script setup>
import { useAuthStore } from '@/store/auth'
import { useUserStore } from '@/store/user'
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'
import PasswordModal from './components/PasswordModal.vue'
import UpdateForm from './components/UpdateForm.vue'
import UserInfoCard from './components/UserInfoCard.vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const showPasswordModal = ref(false)
const isLoading = ref(false)

const handleDeleteUser = async () => {
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

const handleUpdatePassword = async ({ oldPassword, newPassword }) => {
  if (!oldPassword || !newPassword) {
    await Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '請填寫完整密碼資訊',
    })
    return
  }

  try {
    isLoading.value = true
    await userStore.updatePassword(oldPassword, newPassword)
    showPasswordModal.value = false

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

const handleUpdateEmail = async (newEmail) => {
  if (!newEmail) {
    await Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '請填寫新的電子郵件地址',
    })
    return
  }

  try {
    isLoading.value = true
    await userStore.updateEmail(newEmail)

    await Swal.fire({
      icon: 'success',
      title: '成功',
      text: '電子郵件已更新成功',
    })

    await userStore.fetchUser()
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

const handleUpdateUsername = async (newUsername) => {
  if (!newUsername) {
    await Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '請填寫新的使用者名稱',
    })
    return
  }

  try {
    isLoading.value = true
    await userStore.updateUsername(newUsername)

    await Swal.fire({
      icon: 'success',
      title: '成功',
      text: '使用者名稱已更新成功',
    })

    await userStore.fetchUser()
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
  <div v-if="userStore.user" class="max-w-5xl mx-auto px-4 py-6">
    <!-- 頁面標題 -->
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold text-emerald-700 mb-2">
        {{ $t('main.profile.title') }}
      </h1>
      <div class="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- 左側個人資訊 -->
      <div class="lg:col-span-1">
        <UserInfoCard :is-loading="isLoading" @delete-user="handleDeleteUser" />
      </div>

      <!-- 右側更新資訊 -->
      <div class="lg:col-span-2">
        <UpdateForm
          :is-loading="isLoading"
          @update-username="handleUpdateUsername"
          @update-email="handleUpdateEmail"
          @show-password-modal="showPasswordModal = true"
        />
      </div>
    </div>
  </div>

  <!-- 載入中狀態 -->
  <div v-else class="flex flex-col items-center justify-center min-h-[60vh]">
    <div
      class="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"
    ></div>
    <p class="text-base text-emerald-700 mt-3">
      {{ $t('main.profile.loading') }}
    </p>
  </div>

  <!-- 修改密碼彈窗 -->
  <PasswordModal
    :show="showPasswordModal"
    :is-loading="isLoading"
    @close="showPasswordModal = false"
    @update-password="handleUpdatePassword"
  />
</template>
