import { createRouter, createWebHistory } from 'vue-router'
import AppNavigation from "@/components/AppNavigation.vue";
import Videos from '@/views/Videos.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppNavigation,
    },
    {
      path: '/about',
      name: 'videos',
      component: Videos,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
    },
  ],
})

export default router
