import { Request, Response } from 'express'
import Schedule from '../entities/Schedule'
import RealTimeData from '../entities/RealTimeData'

export class ScheduleController {
  // 获取Day ahead指定日期的所有数据
  async getDayAheadSchedule(req: Request, res: Response) {
    try {
      const { date } = req.body
      const scheduleData = await Schedule.find({ date })

      // 返回该日期的所有数据
      res.status(200).json(scheduleData)
    } catch (error) {
      res.status(500).json({
        error: `获取数据失败: ${(error as Error).message}`,
      })
    }
  }

  // 获取Real-time指定日期的所有数据
  async getRealTimeSchedule(req: Request, res: Response) {
    const { date } = req.body
    const schedule = await RealTimeData.find({ date })
    res.status(200).json(schedule)
  }
}
