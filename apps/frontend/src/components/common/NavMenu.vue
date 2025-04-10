<script setup lang="ts">
interface NavLink {
  key: string
  link: string
}

defineProps<{
  isOpen: boolean
  isLoading: boolean
  navLinks: NavLink[]
}>()

const emit = defineEmits(['logout'])

const onLogout = () => {
  emit('logout')
}
</script>

<template>
  <div
    class="md:hidden transition-all duration-300"
    :class="{ block: isOpen, hidden: !isOpen }"
  >
    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white backdrop-blur-sm">
      <router-link
        v-for="link in navLinks"
        :key="link.key as string"
        :to="link.link as string"
        class="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-400 hover:after:w-1/3 after:transition-all after:duration-300"
      >
        {{ $t(link.key as string) }}
      </router-link>
      <button
        :disabled="isLoading"
        class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-400 hover:after:w-1/3 after:transition-all after:duration-300"
        @click="onLogout"
      >
        <span v-if="isLoading" class="flex items-center">
          <svg
            class="animate-spin h-4 w-4 mr-2"
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
          {{ $t('navbar.logging_out') }}
        </span>
        <span v-else>{{ $t('navbar.logout') }}</span>
      </button>
    </div>
  </div>
</template>
