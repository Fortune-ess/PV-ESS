import { Request, Response } from 'express'
import Schedule from '../entities/Schedule'
export class ScheduleController {
  // 获取Day ahead指定日期的所有数据
  async getDayAheadSchedule(req: Request, res: Response) {
    try {
      const date = req.params.date
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
    const { date } = req.params
    const schedule = await Schedule.find({ date })
    res.status(200).json(schedule)
  }
}
