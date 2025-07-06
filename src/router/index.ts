// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Mandelbrot from '@/views/Mandelbrot.vue'
import Videos from '@/views/Videos.vue'

const routes = [
  { path: '/', redirect: '/grafik' },
  { path: '/grafik', name: 'Mandelbrot', component: Mandelbrot },
  { path: '/videos', name: 'Videos', component: Videos },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
