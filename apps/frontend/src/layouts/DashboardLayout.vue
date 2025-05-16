<script setup>
import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
</script>

<template>
  <div
    class="flex h-screen w-full overflow-hidden bg-gradient-to-br from-white via-cyan-100/40 to-cyan-200/30"
  >
    <div class="flex flex-col overflow-hidden w-full h-full">
      <DashboardNavbar class="z-50" />
      <main class="overflow-y-auto p-3 flex-1">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <div :key="$route.name" class="w-full max-w-8xl mx-auto h-full">
              <component :is="Component || 'div'" class="h-full" />
            </div>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
}

@media (min-width: 641px) {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 確保內容在縮放時保持比例 */
:deep(*) {
  transform-origin: center center;
}
</style>
