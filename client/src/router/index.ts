import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      // deno-lint-ignore no-local
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/', 
      name: 'home',
      // deno-lint-ignore no-local
      component: () => import('../views/HomeView.vue')
      // TODO: Diese Route später schützen (nur für eingeloggte User)
    }
  ]
})

export default router
