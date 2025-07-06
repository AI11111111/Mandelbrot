<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Lernvideos</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="video in videos" :key="video.id" class="bg-white p-4 rounded shadow">
        <iframe
          :src="getEmbedUrl(video.id)"
          class="w-full aspect-video rounded"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <h2 class="mt-2 text-lg font-semibold text-center">{{ video.title }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const videos = [
  {
    id: 'dctJ7ISkU-4',
    title: 'Was ist die Mandelbrot-Menge?',
  },
  {
    id: 'IKG7AW2lmt0',
    title: 'Komplexe Zahlen erklärt',
  },
  {
    id: '_78kGnsYXLc',
    title: 'Visualisierung der Iteration',
  },
]

function getEmbedUrl(id: string) {
  return `https://www.youtube.com/embed/${id}`
}
</script>
