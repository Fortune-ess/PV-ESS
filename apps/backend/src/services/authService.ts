import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import appDataSource from '../data-source'
import { User } from '../entities/User'
import {
  clearFailedLogin,
  recordFailedLogin,
} from '../middleware/loginRateLimiter'

export class AuthService {
  private userRepository = appDataSource.getRepository(User)

  async register(username: string, email: string, password: string) {
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    })
    if (existingUser) {
      throw new Error('Username or email already exists')
    }
    // 檢查密碼是否包含至少一個大寫字母、一個小寫字母和一個數字
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/ // 至少一個小寫字母、一個大寫字母、一個數字
    if (!passwordRegex.test(password)) {
      throw new Error(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      )
    }
    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    })
    return await this.userRepository.save(user)
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      recordFailedLogin(email)
      throw new Error('Error email or password!')
    }
    // successful login, clear failed login attempts
    clearFailedLogin(email)

    // generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      {
        algorithm: 'HS256',
        expiresIn: '1d',
        // issuer: '' // domain name
      },
    )
    const userWithoutPassword = { ...user, password: undefined }
    return { user: userWithoutPassword, token }
  }

  logout() {
    return { message: 'Logout successfully!' }
  }
}
