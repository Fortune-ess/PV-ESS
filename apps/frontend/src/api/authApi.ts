import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.41.63:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_X_API_KEY,
  },
  withCredentials: true,
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., invalid API key)
      console.error('Authentication error:', error.response.data)
    }
    return Promise.reject(error)
  },
)

export function useAuthApi() {
  const login = async (email: string, password: string) => {
    return await api.post('/auth/login', { email, password })
  }

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    return await api.post('/auth/register', { username, email, password })
  }

  const logout = async (config = {}) => {
    return await api.post('/auth/logout', {}, config)
  }

  const me = async () => {
    return await api.get('/auth/me')
  }

  const forgotPassword = async (email: string) => {
    return await api.post('/auth/forgot-password', { email })
  }

  const verifyResetToken = async (resetToken: string) => {
    return await api.post('/auth/verify-reset-token', { resetToken })
  }

  const resetPassword = async (token: string, password: string) => {
    return await api.post('/auth/reset-password', { token, password })
  }

  const verifyEmail = async (token: string) => {
    return await api.get(`/auth/verify-email?token=${token}`)
  }

  return {
    login,
    register,
    logout,
    me,
    forgotPassword,
    resetPassword,
    verifyResetToken,
    verifyEmail,
  }
}
