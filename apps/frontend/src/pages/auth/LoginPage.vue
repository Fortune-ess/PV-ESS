<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue' /* PartiallyEnd: #3632/scriptSetup.vue */
</script>

<template>
  <div
    class="flex h-screen items-center justify-center bg-gray-50 overflow-hidden"
  >
    <div class="fixed bottom-4 right-4 z-50">
      <LanguageSwitcher direction="up" />
    </div>
    <div
      class="relative z-[2] bg-white rounded-lg p-12 w-[400px] flex flex-col items-center justify-center text-start shadow-md"
    >
      <img src="/logo01.png" class="w-40 mb-6" />
      <h2 class="text-xl font-semibold text-gray-800 mb-2">
        {{ $t('auth.welcome') }}
      </h2>
      <h3 class="text-sm text-gray-500 font-normal mb-8">
        {{ $t('auth.welcome_description') }}
      </h3>
      <LoginForm />
      <p class="text-sm text-gray-500 mt-6">
        {{ $t('auth.sign_up_prompt') }}
        <router-link to="/register" class="text-blue-600 hover:text-blue-800">{{
          $t('auth.sign_up')
        }}</router-link>
      </p>
    </div>
  </div>
</template>
