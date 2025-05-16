import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { redisClient } from '../config/redis'
import { AuthService } from '../services/authService'
import { PasswordResetService } from '../services/passwordResetService'
import { UserService } from '../services/userService'
import { errorResponse, successResponse } from '../utils/response'

dotenv.config()

export class AuthController {
  private authService = new AuthService()
  private passwordResetService = new PasswordResetService()
  private userService = new UserService()

  async register(req: Request, res: Response) {
    try {
      const user = await this.authService.register(
        req.body.username,
        req.body.email,
        req.body.password,
      )
      successResponse(res, user)
    } catch (error) {
      errorResponse(res, (error as Error).message)
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { token, user } = await this.authService.login(
        req.body.email,
        req.body.password,
      )

      // 設置 HttpOnly Cookie
      res.cookie('token', token, {
        httpOnly: true, // 防止 XSS 攻擊
        secure: false, // HTTPS 限制
        sameSite: 'lax', // 限制 CSRF 攻擊
        maxAge: 3600000 * 24 * 30, // 30 天
        // domain: process.env.DOMAIN,
      })

      res.status(200).json({ user })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // 取得從 Cookie 中傳來的 JWT
      const token = req.cookies.token
      if (!token) {
        return res.status(400).json({ message: 'No token provided!' })
      }

      // 驗證 token 並解碼
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: number
      }
      const userId = decoded.id

      // 在 Redis 中加入黑名單 (JWT token 與用戶 ID)
      await redisClient.setex(`blacklist_${token}`, 3600, userId) // 設定 1 小時過期時間

      // 清除 Cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        // domain: process.env.DOMAIN,
      })

      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Logout failed', error: (error as Error).message })
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body
      const user = await this.userService.findUserByEmail(email)

      if (!user) {
        return errorResponse(res, 'User not found')
      }

      // 生成重設密碼 Token 並儲存
      const resetToken =
        await this.passwordResetService.generateResetToken(email)

      // 發送重設密碼郵件（假設有一個 email service）
      await this.passwordResetService.sendResetEmail(email, resetToken)

      successResponse(res, {
        message: 'Password reset link has been sent to your email.',
      })
    } catch (error) {
      errorResponse(res, (error as Error).message)
    }
  }

  async verifyResetToken(req: Request, res: Response) {
    const { resetToken } = req.body
    const userId = await redisClient.get(`reset_token_${resetToken}`) // 加上前缀
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: 'Token is required' })
    }

    try {
      const result = await this.passwordResetService.verifyResetToken(
        resetToken as string,
      )
      return res.json(result)
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: (error as Error).message })
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const user = await this.passwordResetService.resetPassword(
        req.body.token,
        req.body.password,
      )
      successResponse(res, user)
    } catch (error) {
      errorResponse(res, (error as Error).message)
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query
      if (!token || typeof token !== 'string') {
        return errorResponse(res, 'Invalid verification token')
      }

      const result = await this.authService.verifyEmail(token as string)
      successResponse(res, result)
    } catch (error) {
      errorResponse(res, (error as Error).message)
    }
  }

  async contactUs(req: Request, res: Response) {
    try {
      const { name, email, subject, message } = req.body

      // Create transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      })

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyto: email,
        subject: `Contact Form: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px; background-color: #f9f9f9;">
            <h2 style="color: #333; border-bottom: 2px solid #4a90e2; padding-bottom: 10px;">New Contact Form Submission</h2>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 15px;">
              <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Email:</strong> <a href="mailto:${email}" style="color: #333; text-decoration: none;">${email}</a></p>
              <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Subject:</strong> ${subject}</p>
              <div style="margin: 15px 0;">
                <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Message:</strong></p>
                <div style="background-color: #f5f5f5; padding: 12px; border-left: 4px solid #4a90e2; margin-top: 5px;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
            <div style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
              <p>This is an automated message from your contact form.</p>
            </div>
          </div>
        `,
      }

      // Send email
      await transporter.sendMail(mailOptions)

      successResponse(res, { message: 'Email sent successfully' })
    } catch (error) {
      console.error('Error sending contact email:', error)
      errorResponse(res, 'Failed to send email')
    }
  }
}
