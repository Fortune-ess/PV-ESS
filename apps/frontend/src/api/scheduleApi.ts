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

export function useScheduleApi() {
  const dayAheadData = async (date: string) => {
    return await api.post('/schedule/day-ahead', { date })
  }

  const realTimeData = async (date: string) => {
    return await api.post('schedule/real-time', { date })
  }

  return { dayAheadData, realTimeData }
}
