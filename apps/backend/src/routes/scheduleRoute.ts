import express, { Request, Response } from 'express'
import { ScheduleController } from '../controllers/scheduleController'

const router = express.Router()
const scheduleController = new ScheduleController()

// Day ahead schedule
router.post('/day-ahead', async (req: Request, res: Response) => {
  try {
    await scheduleController.getDayAheadSchedule(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

// real-time schedule
router.post('/real-time', async (req: Request, res: Response) => {
  try {
    await scheduleController.getRealTimeSchedule(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

export default router
