// client/src/router/index.ts
import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/AuthStore.ts'
function getAuthStore() {
  return useAuthStore();
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      // deno-lint-ignore no-local
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false } // Login Route benötigt kein Login
    },
    {
      path: '/',
      name: 'home',
      // deno-lint-ignore no-local
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation Guard zur Überprüfung der Authentifizierung
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = getAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isLoggedIn) {
    // Fall 1: Route erfordert Login, aber User ist NICHT eingeloggt
    console.log('Zugriff verweigert, Weiterleitung zu /login');
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore.isLoggedIn) {
    // Fall 2: User ist eingeloggt und versucht, zur Login-Seite zu gehen
    console.log('Bereits eingeloggt, Weiterleitung zu /');
    next({ name: 'home' });
  } else {
    // Fall 3: Alles okay (Route erfordert keinen Login ODER User ist eingeloggt)
    next(); // Erlaube die Navigation
  }
});

export default router
