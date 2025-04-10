<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div
    class="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#b8f719] shadow-lg hover:shadow-[#b8f719]/20 transition-all duration-500"
  >
    <div
      class="h-12 w-12 bg-gradient-to-br from-[#b8f719] to-emerald-500 rounded-xl mb-6 flex items-center justify-center"
    >
      <svg
        class="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        v-html="icon"
      />
    </div>
    <h3 class="text-xl font-semibold text-gray-800 mb-4">
      {{ title }}
    </h3>
    <p class="text-gray-600 mb-6 line-clamp-3">
      {{ description }}
    </p>
    <a
      v-if="buttonText"
      href="#"
      class="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#b8f719] to-emerald-500 rounded-lg hover:from-[#b8f719]/90 hover:to-emerald-600 transition-all duration-300"
    >
      {{ buttonText }}
      <svg
        class="w-4 h-4 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  </div>
</template>

<style scoped>
.group:hover {
  transform: translateY(-8px);
}
</style>
