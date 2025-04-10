import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  // 登入驗證後 requiresAuth代表需要登入驗證才能造訪
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/home/HomePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/pages/contact/Contact.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/main',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      {
        path: 'main',
        redirect: 'main',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/DashboardPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'report',
        name: 'Report',
        component: () => import('@/pages/reports/Report.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('@/pages/schedule/SchedulePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'system-monitor',
        name: 'System-monitor',
        component: () => import('@/pages/system/SystemMonitor.vue'),
      },
      {
        path: 'system-controller',
        name: 'System-controller',
        component: () => import('@/pages/system/SystemController.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/profile/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/settings/SettingsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  // 尚未登入可使用isPublic代表公開的 requireGuest代表登入後不可造訪
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { isPublic: true, requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/auth/RegisterPage.vue'),
    meta: { isPublic: true, requiresGuest: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
    meta: { isPublic: true, requiresGuest: true },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/pages/auth/ResetPasswordPage.vue'),
    props: (route) => ({ token: route.query.token }),
    beforeEnter: (to, from, next) => {
      if (!to.query.token) {
        next('/forgot-password')
      } else {
        next()
      }
    },
  },
  {
    path: '/terms-conditions',
    name: 'TermsConditions',
    component: () => import('@/pages/auth/TermsConditions.vue'),
    meta: { isPublic: true, requiresGuest: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/NotFoundPage.vue'),
  },
]
