<template>
  <!-- 動畫圖標群組 -->
  <!-- Old PV System to middle -->
  <div
    v-if="oldPVStatus === 'normal'"
    class="absolute top-[22%] left-[32%] w-[18%] z-20"
  >
    <Zap
      v-for="(opacity, index) in [1, 0.7, 0.4]"
      :key="index"
      class="w-4 h-4 text-emerald-500 absolute transform -translate-y-1/2"
      :class="[
        `opacity-${opacity * 100}`,
        { 'animate-pulse': oldPVStatus === 'normal' },
      ]"
      :style="getAnimationStyle(index, 'left')"
    />
  </div>

  <!-- middle to Grid Output -->
  <div
    v-if="status === 'normal'"
    class="absolute top-[22%] right-[32%] w-[18%] z-20"
  >
    <Zap
      v-for="(opacity, index) in [1, 0.7, 0.4]"
      :key="index"
      class="w-4 h-4 text-emerald-500 absolute transform -translate-y-1/2"
      :class="[
        `opacity-${opacity * 100}`,
        { 'animate-pulse': status === 'normal' },
      ]"
      :style="getAnimationStyle(index, 'right')"
    />
  </div>

  <!-- New PV System to middle -->
  <div
    v-if="solarStatus === 'normal'"
    class="absolute top-[75%] left-[32%] w-[18%] z-20"
  >
    <Zap
      v-for="(opacity, index) in [1, 0.7, 0.4]"
      :key="index"
      class="w-4 h-4 text-emerald-500 absolute transform -translate-y-1/2"
      :class="[
        `opacity-${opacity * 100}`,
        { 'animate-pulse': solarStatus === 'normal' },
      ]"
      :style="getAnimationStyle(index, 'left')"
    />
  </div>

  <!-- Battery System to middle -->
  <div
    v-if="batteryStatus === 'normal'"
    class="absolute top-[75%] right-[32%] w-[18%] z-20"
  >
    <Zap
      v-for="(opacity, index) in [1, 0.7, 0.4]"
      :key="index"
      class="w-4 h-4 text-emerald-500 absolute transform -translate-y-1/2"
      :class="[
        `opacity-${opacity * 100}`,
        { 'animate-pulse': batteryStatus === 'normal' },
      ]"
      :style="getAnimationStyle(index, 'right')"
    />
  </div>

  <!-- Middle bottom to Middle top -->
  <div
    v-if="animationTriggered"
    class="absolute top-[25%] left-[50%] h-[52%] z-20 transform -translate-x-1/2"
  >
    <Zap
      v-for="(opacity, index) in [1, 0.7, 0.4]"
      :key="index"
      class="w-4 h-4 text-emerald-500 absolute transform -translate-x-1/2"
      :class="[
        `opacity-${opacity * 100}`,
        { 'animate-pulse': animationTriggered },
      ]"
      :style="getVerticalAnimationStyle(index)"
    />
  </div>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/store/systemStore'
import { Zap } from 'lucide-vue-next'

const {
  animationStep,
  animationTriggered,
  currentAnimationSource,
  oldPVStatus,
  status,
  solarStatus,
  batteryStatus,
} = useSystemStore()

const getAnimationStyle = (index: number, direction: 'left' | 'right') => {
  const positions = {
    0: '10%',
    1: '40%',
    2: '70%',
  }
  const step = (animationStep.value + index) % 3
  return {
    [direction]: positions[step as keyof typeof positions],
    transition: 'all 0.5s ease-in-out',
  }
}

const getVerticalAnimationStyle = (index: number) => {
  const positions = {
    0: '10%',
    1: '40%',
    2: '70%',
  }
  const step = (animationStep.value + index) % 3
  return {
    top: positions[step as keyof typeof positions],
    transition: 'all 0.5s ease-in-out',
  }
}
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
