<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans">
    <!-- Stylisierte Navigation -->
    <nav class="bg-white shadow sticky top-0 z-50">
        <div class="flex justify-between items-center">
            <RouterLink
              to="/grafik"
              class="flex-2 text-center text-2xl font-bold  h-16"
              :class="{ 'bg-[hsla(160,_100%,_37%,_.2)]': $route.path === '/grafik' }"
            >
              Grafik
            </RouterLink>
            <RouterLink
              to="/videos"
              class="flex-2 text-center my-6 text-2xl font-bold  h-16"
              :class="{ 'bg-[hsla(160,_100%,_37%,_.2)]': $route.path === '/videos' }"
            >
              Videos
            </RouterLink>
        </div>
    </nav>

    <!-- Dynamischer Inhalt -->
    <main class="py-15 px-5 max-w-7xl mx-auto">
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
