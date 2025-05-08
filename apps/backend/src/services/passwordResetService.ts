import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'
import appDataSource from '../config/data-source'
import { redisClient } from '../config/redis'
import { User } from '../entities/User'

dotenv.config()

export class PasswordResetService {
  private userRepository = appDataSource.getRepository(User)
  // private transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // })
  private transporter = nodemailer.createTransport({
    host: 'mail.fortune.com.tw',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  // 生成密碼重設 Token和email做存儲
  async generateResetToken(email: string) {
    const resetToken = uuidv4() // 生成唯一 Token
    const expiresIn = 3600 // 過期時間 (1 小時)

    await redisClient.setex(`reset_token_${resetToken}`, expiresIn, email)
    return resetToken
  }

  // 發送重設密碼郵件
  async sendResetEmail(email: string, resetToken: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'PV-ESS Password Reset Request',
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Please click the link below to reset your password:</p>
            <p><a href="${resetLink}" style="color: #007bff; text-decoration: none;">Reset Your Password</a></p>
            <p>If you did not request this, please ignore this email. The link will expire in 1 hour.</p>
            <br />
            <p>Best regards,</p>
            <p>華城電機 儲能中心開發課 郭來鴻</p>
          </div>
        `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully')
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  // 驗證重設密碼 Token 是否有效
  async verifyResetToken(resetToken: string) {
    const email = await redisClient.get(`reset_token_${resetToken}`)

    if (!email) {
      return false
    }

    return true
  }

  // 重設密碼(未登入)
  async resetPassword(resetToken: string, newPassword: string) {
    // 驗證 Token
    const email = await redisClient.get(`reset_token_${resetToken}`)

    if (!email) {
      return { message: 'Invalid or expired token' }
    }

    const user = await this.userRepository.findOne({ where: { email: email } })

    if (!user) {
      return { message: 'User not found' }
    }

    // 更新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await this.userRepository.save(user)

    // 刪除 Redis Token，防止重複使用
    await redisClient.del(`reset_token_${resetToken}`)

    return { message: 'Password reset successfully' }
  }
}
