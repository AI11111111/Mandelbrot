<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans">
    <!-- Stylisierte Navigation -->
    <nav class="bg-white shadow sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <h1 class="text-2xl font-bold hsla(160, 100%, 37%, 1)">🎨 Mandelbrot</h1>
          <div class="flex space-x-6 text-sm font-medium">
            <RouterLink
              to="/grafik"
              class="transition duration-200 px-3 py-2 rounded bg-blue-100 hover:text-blue-600"
              :class="{ 'bg-blue-100 text-white': $route.path === '/grafik' }"
            >
                <ImageIcon class="inline w-4 h-4 mr-1" /> Grafik
            </RouterLink>
            <RouterLink
              to="/videos"
              class="transition duration-200 px-3 py-2 rounded hover:bg-blue-100 hover:text-blue-600"
              :class="{ 'bg-blue-100 text-white': $route.path === '/videos' }"
            >
              <Video class="inline w-4 h-4 mr-1" />  Videos
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Dynamischer Inhalt -->
    <main class="p-6 max-w-5xl mx-auto">
      <RouterView />
    </main>
  </div>
</template>
<script setup>
import { Video, Image as ImageIcon } from 'lucide-vue-next'
</script>

<style scoped>
/* Optional: sanfte Übergänge bei Seitenwechsel */
main {
  transition: opacity 0.3s ease;
}
</style>
