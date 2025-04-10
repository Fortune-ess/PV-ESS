<script setup lang="ts">
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import MenuButton from '@/components/common/MenuButton.vue'
import NavMenu from '@/components/common/NavMenu.vue'
import { useAuthStore } from '@/store/auth'
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = ref(false)

interface NavLink {
  key: string
  link: string
}

const navLinks: NavLink[] = [
  { key: 'navbar.home', link: '/home' },
  { key: 'navbar.products', link: '/products' },
  { key: 'navbar.solutions', link: '/solutions' },
  { key: 'navbar.contact', link: '/contact' },
]

const handleSubmit = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    await authStore.logout()
    await Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: t('navbar.logout_success'),
      timer: 1500,
      showConfirmButton: false,
    })
    await router.push('/login')
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: (error as Error).message,
      confirmButtonText: 'OK',
    })
  } finally {
    isLoading.value = false
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="bg-white transition-all duration-300 relative z-50">
    <div class="max-w-7xl mx-auto p-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <img src="/logo.png" class="w-50 h-10" />
        </div>
        <div class="hidden md:flex space-x-8">
          <router-link
            v-for="link in navLinks"
            :key="link.key"
            :to="link.link"
            class="text-black hover:text-gray-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-400 hover:after:w-full after:transition-all after:duration-300"
          >
            {{ $t(link.key) }}
          </router-link>
          <div class="fixed bottom-4 right-4 z-50">
            <LanguageSwitcher direction="up" />
          </div>
        </div>
        <div class="items-center justify-center text-center hidden md:flex">
          <button
            v-if="authStore.isAuthenticated"
            :disabled="isLoading"
            type="button"
            class="bg-[#b8f719] p-2 px-4 rounded-2xl text-black/80 shadow-2xs shadow-green-300 transition-transform duration-200 hover:scale-105 whitespace-nowrap"
            @click="handleSubmit"
          >
            {{ $t('navbar.logout') }}
          </button>
          <span class="bg-[#b8f719] py-2 px-1"></span>
          <router-link
            class="bg-black/80 rounded-2xl p-2 px-4 text-white w-full shadow-2xl transition-transform duration-200 hover:scale-105"
            to="/main/dashboard"
          >
            {{ $t('home.hero.button') }}
          </router-link>
        </div>
        <div class="md:hidden">
          <MenuButton :is-open="isMenuOpen" @toggle="toggleMenu" />
        </div>
      </div>
    </div>
    <NavMenu
      :is-open="isMenuOpen"
      :is-loading="isLoading"
      :nav-links="navLinks"
      @logout="handleSubmit"
    />
  </nav>
</template>
