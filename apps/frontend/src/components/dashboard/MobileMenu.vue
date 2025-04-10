<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 lg:hidden">
    <div class="fixed inset-0 bg-black/50" @click="$emit('close')"></div>
    <div class="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold">Menu</h2>
      </div>
      <nav class="p-4">
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.id">
            <div>
              <button
                @click="
                  item.hasSubmenu
                    ? toggleSubmenu(item.id)
                    : navigateTo(item.link)
                "
                class="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === item.link }"
              >
                <component
                  :is="item.lucideIcon"
                  class="h-5 w-5 mr-3 text-gray-500"
                />
                <span>{{ item.id }}</span>
                <component
                  v-if="item.hasSubmenu"
                  :is="expandedSubmenu === item.id ? ChevronUp : ChevronDown"
                  class="h-4 w-4 ml-auto text-gray-500"
                />
              </button>
              <div
                v-if="item.hasSubmenu && expandedSubmenu === item.id"
                class="ml-8 mt-1 space-y-1"
              >
                <button
                  v-for="subItem in item.submenu"
                  :key="subItem.id"
                  @click="navigateTo(subItem.link)"
                  class="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
                  :class="{ 'bg-gray-100': route.path === subItem.link }"
                >
                  <span>{{ subItem.id }}</span>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      <div class="absolute bottom-0 w-full border-t border-gray-200 p-4">
        <ul class="flex justify-around">
          <li v-for="item in footerNavItems" :key="item.name">
            <button
              @click="navigateTo(item.link)"
              class="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900"
            >
              <component :is="item.icon" class="h-5 w-5 mb-1" />
              <span class="text-xs">{{ item.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const expandedSubmenu = ref('')

defineProps<{
  isOpen: boolean
  menuItems: any[]
  footerNavItems: any[]
}>()

defineEmits(['close'])

const toggleSubmenu = (itemId: string) => {
  if (expandedSubmenu.value === itemId) {
    expandedSubmenu.value = ''
  } else {
    expandedSubmenu.value = itemId
  }
}

const navigateTo = (link: string) => {
  if (link) {
    router.push(link)
  }
}
</script>
