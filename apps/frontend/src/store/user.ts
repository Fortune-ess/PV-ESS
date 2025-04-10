import { useUserApi } from '@/api/userApi'
import { User } from '@/types/userType'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),

  actions: {
    async fetchUser() {
      try {
        const { getUserProfile } = useUserApi()
        this.user = await getUserProfile()
        console.log(this.user)
        return this.user
      } catch (error) {
        console.error('Error fetching user:', error)
        this.user = null
        throw error
      }
    },
    async updatePassword(oldPassword: string, newPassword: string) {
      const { updatePassword } = useUserApi()
      return await updatePassword(oldPassword, newPassword)
    },
    async updateEmail(newEmail: string) {
      const { updateEmail } = useUserApi()
      return await updateEmail(newEmail)
    },
    async updateUsername(newUsername: string) {
      const { updateUsername } = useUserApi()
      return await updateUsername(newUsername)
    },
    async deleteUser() {
      const { deleteUser } = useUserApi()
      return await deleteUser()
    },
  },
})
