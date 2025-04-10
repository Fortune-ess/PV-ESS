<script setup>
import Footer from '@/components/common/Footer.vue'
import Navbar from '@/components/home/Navbar.vue'
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

function submitForm() {
  console.log('表單已提交：', formData.value)
  alert('感謝您的訊息，我們會盡快與您聯繫！')
  resetForm()
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
          <strong class="font-medium">地址：</strong>台北市信義區松仁路123號
        </p>
        <p><strong class="font-medium">電話：</strong>(02) 1234-5678</p>
        <p>
          <strong class="font-medium">營業時間：</strong>週一至週五 09:00 -
          18:00
        </p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-700 mb-6">發送訊息</h2>
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
            >主題：</label
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
        >
          送出
        </button>
      </form>
    </div>
  </div>
  <Footer />
</template>
