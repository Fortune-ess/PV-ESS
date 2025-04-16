import bcrypt from 'bcryptjs'
import appDataSource from '../config/data-source'
import { User } from '../entities/User'

export class UserService {
  private userRepository = appDataSource.getRepository(User)

  async getUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    })
  }

  async updateUser(id: number, username: string, email: string) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) throw new Error('User not found')

    user.username = username || user.username
    user.email = email || user.email
    return await this.userRepository.save(user)
  }

  async updatePassword(id: number, oldPassword: string, newPassword: string) {
    // Find the user by ID
    const user = await this.userRepository.findOneBy({ id })
    if (!user) throw new Error('User not found')

    // Compare the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) throw new Error('Old password is incorrect')

    // Ensure the new password is different from the old password
    if (oldPassword === newPassword)
      throw new Error('New password cannot be the same as old password')

    // Validate new password strength (at least 8 characters, one uppercase, one lowercase, one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(newPassword)) {
      throw new Error(
        'New password must have at least 8 characters, including uppercase, lowercase, and a number',
      )
    }
    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword

    // Save the updated user password
    return await this.userRepository.save(user)
  }

  async updateEmail(id: number, newEmail: string) {
    // 檢查用戶是否存在
    const user = await this.userRepository.findOneBy({ id })
    if (!user) throw new Error('用戶不存在')

    // 檢查新郵箱是否已被使用
    const existingUser = await this.userRepository.findOneBy({
      email: newEmail,
    })
    if (existingUser) throw new Error('此郵箱已被使用')

    // 驗證郵箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      throw new Error('無效的郵箱格式')
    }

    // 更新郵箱
    user.email = newEmail

    // 保存更新後的用戶信息
    return await this.userRepository.save(user)
  }

  async updateUsername(id: number, newUsername: string) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) throw new Error('User not found')
    user.username = newUsername
    return await this.userRepository.save(user)
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) throw new Error('User not found')
    return await this.userRepository.remove(user)
  }

  // 查詢用戶是否存在
  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email })
  }
}
