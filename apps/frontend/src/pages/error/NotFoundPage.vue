<script>
export default {
  name: 'NotFound',
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col justify-center items-center"
  >
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-800">404</h1>
      <h2 class="text-6xl font-medium py-8 text-gray-700">Page not found</h2>
      <p class="text-2xl pb-8 px-12 text-gray-600">
        Oops! The page you're looking for doesn't exist.
      </p>
      <router-link
        to="/"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
      >
        Go Home
      </router-link>
    </div>
  </div>
</template>
