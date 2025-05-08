<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CheckCircle, XCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const verificationStatus = ref<string>('')
const error = ref<string>('')
const authStore = useAuthStore()

const verifyEmailToken = async () => {
  try {
    const token = route.query.token as string
    if (!token) {
      throw new Error('No verification token provided')
    }

    const response = await authStore.verifyEmail(token)
    verificationStatus.value = response.data.message
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = (err as Error).message
  }
}

onMounted(() => {
  verifyEmailToken()
})
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>
      <div class="mt-8 space-y-6">
        <Suspense>
          <template #default>
            <div v-if="verificationStatus" class="rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <CheckCircle
                    class="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Success</h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>{{ verificationStatus }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="error" class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <XCircle class="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error</h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>{{ error }}</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #fallback>
            <div class="flex justify-center">
              <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
              ></div>
            </div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>
