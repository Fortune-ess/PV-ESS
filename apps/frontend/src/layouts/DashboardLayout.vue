<script setup>
import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
</script>

<template>
  <div
    class="flex h-svh w-full overflow-hidden bg-gradient-to-br from-white via-cyan-100/40 to-cyan-200/30"
  >
    <div class="flex-1 flex flex-col overflow-hidden">
      <DashboardNavbar class="z-50" />
      <main class="overflow-y-auto p-3">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <div :key="$route.name" class="w-full max-w-8xl mx-auto">
              <component :is="Component || 'div'" />
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
</style>
