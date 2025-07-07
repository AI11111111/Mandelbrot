import { createRouter, createWebHistory } from 'vue-router'
import Mandelbrot from '@/views/Mandelbrot.vue'
import Videos from '@/views/Videos.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/graphic', component: Mandelbrot },
    { path: '/videos', component: Videos },
  ]
})

export default router
