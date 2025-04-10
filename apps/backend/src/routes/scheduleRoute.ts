import express, { Request, Response } from 'express'
import { ScheduleController } from '../controllers/scheduleController'

const router = express.Router()
const scheduleController = new ScheduleController()

// Day ahead schedule
router.get('/day-ahead/:date', async (req: Request, res: Response) => {
  try {
    await scheduleController.getDayAheadSchedule(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

// real-time schedule
router.get('/real-time/:date', async (req: Request, res: Response) => {
  try {
    await scheduleController.getRealTimeSchedule(req, res)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

// // 創建排程
// router.post('/', async (req: Request, res: Response) => {
//   try {
//     await scheduleController.createSchedule(req, res)
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message })
//   }
// })

// // 獲取所有排程
// router.get('/', async (req: Request, res: Response) => {
//   try {
//     await scheduleController.getSchedule(req, res)
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message })
//   }
// })

// // 依照選擇的日期和timestamp獲取排程
// router.get('/:date/:timestamp', async (req: Request, res: Response) => {
//   try {
//     await scheduleController.getScheduleByDateAndTimestamp(req, res)
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message })
//   }
// })

// // 依照選擇的日期獲取排程
// router.get('/:date', async (req: Request, res: Response) => {
//   try {
//     await scheduleController.getScheduleByDate(req, res)
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message })
//   }
// })

// // 依照選擇的日期和timestamp獲取排程
// router.get('/:date/:timestamp', async (req: Request, res: Response) => {
//   try {
//     await scheduleController.getScheduleByDateAndTimestamp(req, res)
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message })
//   }
// })

// // 依照id更新排程
// router.put('/:id', async (req: Request, res: Response) => {
//   try {
//     await scheduleController.updateSchedule(req, res)
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message })
//   }
// })

// // 依照id刪除排程
// router.delete('/:id', async (req: Request, res: Response) => {
//   try {
//     await scheduleController.deleteSchedule(req, res)
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message })
//   }
// })

// // 刪除所有排程
// router.delete('/', async (req: Request, res: Response) => {
//   try {
//     await scheduleController.deleteAllSchedule(req, res)
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message })
//   }
// })

export default router
