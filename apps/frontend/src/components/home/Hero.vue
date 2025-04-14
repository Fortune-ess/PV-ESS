<script setup>
import { useMotion } from '@vueuse/motion'
</script>

<template>
  <div
    v-motion
    class="relative overflow-hidden"
    :initial="{ opacity: 0, y: 100 }"
    :enter="{ opacity: 1, y: 0 }"
    :visible="{ once: true, amount: 0.2 }"
  >
    <div class="max-w-7xl mx-auto">
      <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
        <main
          class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28"
        >
          <div class="text-center">
            <h1
              v-motion
              class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
              :initial="{ opacity: 0, y: 100 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
            >
              <span
                class="block bg-clip-text text-transparent bg-gradient-to-r from-gray-500 via-gray-400 to-gray-300"
              >
                {{ $t('home.hero.title') }}
              </span>
              <span class="block text-gray-300 mt-2">
                {{ $t('home.hero.subtitle') }}
              </span>
            </h1>
            <p
              v-motion
              class="mt-3 text-base text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl"
              :initial="{ opacity: 0, y: 50 }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: { duration: 800, delay: 200 },
              }"
            >
              {{ $t('home.hero.description') }}
            </p>
            <div
              v-motion
              class="mt-5 sm:mt-8 sm:flex sm:justify-center"
              :initial="{ opacity: 0, scale: 0.8 }"
              :enter="{
                opacity: 1,
                scale: 1,
                transition: { duration: 500, delay: 400 },
              }"
            >
              <div class="rounded-md shadow">
                <router-link
                  to="/main/dashboard"
                  class="animated-border w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 transform hover:scale-105 transition-all duration-300 md:py-4 md:text-lg md:px-10 relative overflow-hidden"
                >
                  {{ $t('home.hero.button') }}
                  <span class="border-animate"></span>
                  <span class="border-animate"></span>
                  <span class="border-animate"></span>
                  <span class="border-animate"></span>
                </router-link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animated-border {
  position: relative;
  overflow: hidden;
}

.border-animate {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(209, 213, 219, 0.3));
}

.border-animate:nth-child(1) {
  width: 100%;
  height: 1px;
  top: 0;
  left: -100%;
  animation: animate1 3s linear infinite;
}

.border-animate:nth-child(2) {
  width: 1px;
  height: 100%;
  top: -100%;
  right: 0;
  animation: animate2 3s linear infinite;
}

.border-animate:nth-child(3) {
  width: 100%;
  height: 1px;
  bottom: 0;
  right: -100%;
  animation: animate3 3s linear infinite;
}

.border-animate:nth-child(4) {
  width: 1px;
  height: 100%;
  bottom: -100%;
  left: 0;
  animation: animate4 3s linear infinite;
}

@keyframes animate1 {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes animate2 {
  0% {
    top: -100%;
  }
  100% {
    top: 100%;
  }
}

@keyframes animate3 {
  0% {
    right: -100%;
  }
  100% {
    right: 100%;
  }
}

@keyframes animate4 {
  0% {
    bottom: -100%;
  }
  100% {
    bottom: 100%;
  }
}
</style>
