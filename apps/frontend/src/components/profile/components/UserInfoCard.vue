<script setup>
import { useUserStore } from '@/store/user'
import Swal from 'sweetalert2'

const props = defineProps({
  isLoading: Boolean
})

const userStore = useUserStore()
const emit = defineEmits(['delete-user'])

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
    emit('delete-user')
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
      <h2 class="text-lg font-bold mb-1">{{ userStore.user.data.username }}</h2>
      <p class="text-emerald-100 text-sm break-all">{{ userStore.user.data.email }}</p>
    </div>
    
    <div class="p-4 space-y-3">
      <div class="space-y-2">
        <h3 class="text-base font-semibold text-emerald-800">{{ $t('main.profile.time_information') }}</h3>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">{{ $t('main.profile.join_date') }}</span>
          <span class="text-gray-800 font-medium">{{ new Date(userStore.user.data.createdAt).toLocaleString() }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">{{ $t('main.profile.update_date') }}</span>
          <span class="text-gray-800 font-medium">{{ new Date(userStore.user.data.updatedAt).toLocaleString() }}</span>
        </div>
      </div>
      
      <button
        @click="handleDeleteUser"
        class="w-full mt-3 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        :disabled="isLoading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        Delete Account
      </button>
    </div>
  </div>
</template> 