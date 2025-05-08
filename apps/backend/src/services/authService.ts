import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import appDataSource from '../config/data-source'
import { User } from '../entities/User'
import {
  clearFailedLogin,
  recordFailedLogin,
} from '../middleware/loginRateLimiter'
import nodemailer from 'nodemailer'
import { redisClient } from '../config/redis'
import crypto from 'crypto'

export class AuthService {
  private userRepository = appDataSource.getRepository(User)
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: true, // Enable debug logging
  })

  // 生成驗證 token
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  // 發送驗證郵件
  private async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    }

    try {
      // Verify SMTP connection configuration
      await this.transporter.verify()
      
      // Send the email
      const info = await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', info.response)
    } catch (error: any) {
      console.error('Email sending failed:', error)
      throw new Error(`Failed to send verification email: ${error.message}`)
    }
  }

  // 修改後的註冊方法
  async register(username: string, email: string, password: string) {
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    })
    if (existingUser) {
      throw new Error('Username or email already exists')
    }

    // 檢查密碼是否包含至少一個大寫字母、一個小寫字母和一個數字
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
    if (!passwordRegex.test(password)) {
      throw new Error(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      )
    }

    // 生成驗證 token
    const verificationToken = this.generateVerificationToken()

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10)

    // 將用戶資料和驗證 token 存入 Redis，設置 24 小時過期
    const userData = {
      username,
      email,
      password: hashedPassword,
    }

    await redisClient.setex(
      `verification_${verificationToken}`,
      24 * 60 * 60, // 24 hours in seconds
      JSON.stringify(userData),
    )

    // 發送驗證郵件
    await this.sendVerificationEmail(email, verificationToken)

    return {
      message: 'Verification email has been sent. Please check your email.',
    }
  }

  // 驗證郵件方法
  async verifyEmail(token: string) {
    // 從 Redis 獲取用戶資料
    const userData = await redisClient.get(`verification_${token}`)

    if (!userData) {
      throw new Error('Invalid or expired verification token')
    }

    // 解析用戶資料
    const user = JSON.parse(userData)

    // 創建用戶實例並保存到數據庫
    const newUser = this.userRepository.create({
      ...user,
      isVerified: true,
    })
    await this.userRepository.save(newUser)

    // 刪除 Redis 中的驗證數據
    await redisClient.del(`verification_${token}`)

    return { message: 'Email verified successfully' }
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      recordFailedLogin(email)
      throw new Error('Error email or password!')
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in')
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
