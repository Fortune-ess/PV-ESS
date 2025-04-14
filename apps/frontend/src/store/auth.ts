import { useAuthApi } from '@/api/authApi'
import { connectSocket, disconnectSocket } from '@/composable/useSocket'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: null as boolean | null,
  }),
  actions: {
    async login(email: string, password: string) {
      const { login } = useAuthApi()
      const res = await login(email, password)
      this.user = res.data.user
      this.isAuthenticated = true
      return res
    },
    async register(username: string, email: string, password: string) {
      const { register } = useAuthApi()
      const res = await register(username, email, password)
      this.user = res.data.user
      this.isAuthenticated = false
      return res
    },
    async logout() {
      const { logout } = useAuthApi()
      await logout()
      disconnectSocket()
      this.user = null
      this.isAuthenticated = false
      window.location.href = '/login'
    },
    async me() {
      const { me } = useAuthApi()
      const res = await me()
      if (res.status === 200) {
        this.user = res.data.user
        this.isAuthenticated = true
        connectSocket()
      } else {
        this.user = null
        this.isAuthenticated = false
      }
    },
    async forgotPassword(email: string) {
      const { forgotPassword } = useAuthApi()
      const res = await forgotPassword(email)
      return res
    },
    async verifyResetToken(resetToken: string) {
      const { verifyResetToken } = useAuthApi()
      const res = await verifyResetToken(resetToken)
      return res
    },
    async resetPassword(token: string, password: string) {
      const { resetPassword } = useAuthApi()
      const res = await resetPassword(token, password)
      return res
    },
  },
})
