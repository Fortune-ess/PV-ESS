<script setup lang="ts">
import Footer from '@/components/common/Footer.vue'
import Features from '@/components/home/Features.vue'
import Hero from '@/components/home/Hero.vue'
import Navbar from '@/components/home/Navbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <div class="px-10 py-4">
      <div class="bg-gray-300/50 rounded-2xl">
        <Hero />
        <Features />
      </div>
    </div>
    <Footer />
  </div>
</template>
