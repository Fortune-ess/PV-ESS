import express, { Request, Response } from 'express'
import { AuthController } from '../controllers/authController'
import { authMiddleware } from '../middleware/authMiddleware'
import { loginRateLimiter } from '../middleware/loginRateLimiter'

const router = express.Router()
const authController = new AuthController()

router.post('/register', async (req: Request, res: Response) => {
  try {
    await authController.register(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

router.post('/login', loginRateLimiter, async (req: Request, res: Response) => {
  try {
    await authController.login(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    await authController.logout(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

router.get('/me', authMiddleware, (req, res) => {
  res.json(req.body.userId)
})

router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    await authController.forgotPassword(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

router.post('/verify-reset-token', async (req: Request, res: Response) => {
  try {
    await authController.verifyResetToken(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    await authController.resetPassword(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

router.get('/verify-email', async (req: Request, res: Response) => {
  try {
    await authController.verifyEmail(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

router.post('/contact', async (req: Request, res: Response) => {
  try {
    await authController.contactUs(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

export default router
