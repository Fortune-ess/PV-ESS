import express from 'express'
import { UserController } from '../controllers/userController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = express.Router()
const userController = new UserController()

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    await userController.getUserById(req, res)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/profile/updatePassword', authMiddleware, async (req, res) => {
  try {
    await userController.updatePassword(req, res)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/profile/updateEmail', authMiddleware, async (req, res) => {
  try {
    await userController.updateEmail(req, res)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/profile/updateUsername', authMiddleware, async (req, res) => {
  try {
    await userController.updateUsername(req, res)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/profile/delete', authMiddleware, async (req, res) => {
  try {
    await userController.deleteUser(req, res)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
