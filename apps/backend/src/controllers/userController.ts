import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserService } from '../services/userService'

export class UserController {
  private userService = new UserService()

  async getUserById(req: Request, res: Response) {
    try {
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number
      }
      const user = await this.userService.getUserById(decoded.userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number
      }

      // 檢查請求體是否包含所需資料
      if (!req.body || !req.body.oldPassword || !req.body.newPassword) {
        return res.status(400).json({ message: '請提供舊密碼和新密碼' })
      }

      const { oldPassword, newPassword } = req.body

      const user = await this.userService.updatePassword(
        decoded.userId,
        oldPassword,
        newPassword,
      )
      res.json(user)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  async updateEmail(req: Request, res: Response) {
    try {
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number
      }

      const { newEmail } = req.body
      const user = await this.userService.updateEmail(decoded.userId, newEmail)
      res.json(user)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  async updateUsername(req: Request, res: Response) {
    try {
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number
      }
      const { newUsername } = req.body
      const user = await this.userService.updateUsername(
        decoded.userId,
        newUsername,
      )
      res.json(user)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number
      }
      await this.userService.deleteUser(decoded.userId)
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }
}
