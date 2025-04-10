<template>
  <nav class="hidden lg:block">
    <ul class="space-y-2">
      <li v-for="item in menuItems" :key="item.id">
        <div>
          <button
            @click="
              item.hasSubmenu ? toggleSubmenu(item.id) : navigateTo(item.link)
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
</template>

<script setup lang="ts">
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const expandedSubmenu = ref('')

defineProps<{
  menuItems: any[]
}>()

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
