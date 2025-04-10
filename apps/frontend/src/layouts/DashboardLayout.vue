<script setup>
import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
</script>

<template>
  <div
    class="flex h-screen w-full overflow-hidde bg-gradient-to-br from-white via-cyan-100/40 to-cyan-200/30"
  >
    <div class="flex-1 flex flex-col overflow-hidden">
      <DashboardNavbar class="z-50" />
      <main class="overflow-y-auto p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <div :key="$route.name">
              <component :is="Component || 'div'" />
            </div>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
