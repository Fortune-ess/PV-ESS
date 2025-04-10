import { User } from '@/types/userType'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export function useUserApi() {
  const getUserProfile = async (): Promise<User> => {
    return await api.get('/users/profile')
  }

  const updatePassword = async (
    oldPassword: string,
    newPassword: string,
  ): Promise<User> => {
    return await api.put('/users/profile/updatePassword', {
      oldPassword,
      newPassword,
    })
  }

  const updateEmail = async (newEmail: string): Promise<User> => {
    return await api.put('/users/profile/updateEmail', { newEmail })
  }

  const updateUsername = async (newUsername: string): Promise<User> => {
    return await api.put('/users/profile/updateUsername', { newUsername })
  }

  const deleteUser = async (): Promise<User> => {
    return await api.delete('/users/profile/delete')
  }

  return {
    getUserProfile,
    updatePassword,
    updateEmail,
    updateUsername,
    deleteUser,
  }
}
