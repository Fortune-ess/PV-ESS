<template>
  <div class="relative overflow-hidden hero-section">
    <div class="max-w-7xl mx-auto">
      <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
        <main
          class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28"
        >
          <div class="text-center">
            <h1
              class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
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
              class="mt-3 text-base text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl"
            >
              {{ $t('home.hero.description') }}
            </p>
            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center">
              <div class="rounded-md shadow">
                <router-link
                  to="/main/dashboard"
                  class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 transform hover:scale-105 transition-all duration-300 md:py-4 md:text-lg md:px-10 relative overflow-hidden"
                >
                  {{ $t('home.hero.button') }}
                </router-link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
