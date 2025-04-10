import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局路由守衛
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  try {
    await authStore.me()
  } catch {
    authStore.isAuthenticated = false
  }

  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresGuest && isAuthenticated) {
    return next('/home')
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router
