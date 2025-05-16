<script setup>
import Footer from '@/components/common/Footer.vue'
import Navbar from '@/components/home/Navbar.vue'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})
const isLoading = ref(false)
const errorMessage = ref('')

async function submitForm() {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await authStore.contactUs(
      formData.value.name,
      formData.value.email,
      formData.value.subject,
      formData.value.message
    )
    
    Swal.fire({
      icon: 'success',
      title: '訊息已送出',
      text: '感謝您的訊息，我們會盡快與您聯繫！',
      confirmButtonColor: '#3085d6'
    })
    resetForm()
  } catch (error) {
    console.error('Error sending message:', error)
    errorMessage.value = '發送訊息時發生錯誤，請稍後再試。'
    Swal.fire({
      icon: 'error',
      title: '發送失敗',
      text: errorMessage.value,
      confirmButtonColor: '#d33'
    })
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
  }
}
</script>

<template>
  <Navbar />
  <div class="h-min-screen mx-auto p-6 space-y-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">聯絡我們</h1>

    <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 class="text-xl font-semibold text-gray-700">公司資訊</h2>
      <div class="space-y-2 text-gray-600">
        <p>
          <strong class="font-medium">地址：</strong>台北市南港區三重路66號11樓(南港軟體工業園區)
        </p>
        <p><strong class="font-medium">電話：</strong>02-26559520 Ext 9896</p>
        <p>
          <strong class="font-medium">營業時間：</strong>週一至週五 09:00 -
          18:00
        </p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-700 mb-6">發送訊息</h2>
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="space-y-1">
          <label for="name" class="block text-sm font-medium text-gray-700"
            >姓名：</label
          >
          <input
            type="text"
            id="name"
            v-model="formData.name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div class="space-y-1">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >電子郵件：</label
          >
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div class="space-y-1">
          <label for="subject" class="block text-sm font-medium text-gray-700"
            >標題：</label
          >
          <input
            type="text"
            id="subject"
            v-model="formData.subject"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div class="space-y-1">
          <label for="message" class="block text-sm font-medium text-gray-700"
            >訊息：</label
          >
          <textarea
            id="message"
            v-model="formData.message"
            rows="5"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          :disabled="isLoading"
        >
          {{ isLoading ? '發送中...' : '送出' }}
        </button>
      </form>
    </div>
  </div>
  <Footer />
</template>
