import { Request, Response } from 'express'
import Schedule from '../entities/Schedule'

// // 添加ScheduleData接口
// interface ScheduleData {
//   qseId: string
//   groupId: number
//   date: string
//   data: {
//     timestamp: string
//     status: number
//     esHSL: number
//     pvEnergy: number
//     esEnergy?: number
//     soc?: number
//   }
// }

export class ScheduleController {
  // // 创建排程
  // async createSchedule(req: Request, res: Response) {
  //   try {
  //     const scheduleData = req.body as ScheduleData[]

  //     // 检查是否已存在相同日期的数据
  //     const existingData = await Schedule.findOne({
  //       date: scheduleData[0].date,
  //     })
  //     if (existingData) {
  //       return res
  //         .status(409)
  //         .json({ message: `${scheduleData[0].date} 已存在` })
  //     }

  //     // 插入多条排程数据
  //     await Schedule.insertMany(scheduleData)
  //     res.status(201).json({ message: `${scheduleData[0].date} 插入成功` })
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ error: `插入排程失败: ${(error as Error).message}` })
  //   }
  // }

  // // 获取所有排程
  // async getSchedule(req: Request, res: Response) {
  //   try {
  //     const schedule = await Schedule.find()
  //     res.json(schedule)
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ error: `Internal server error: ${(error as Error).message}` })
  //   }
  // }

  // // 获取指定日期的排程
  // async getScheduleByDate(req: Request, res: Response) {
  //   try {
  //     const { date } = req.params
  //     const schedule = await Schedule.find({ date })
  //     res.json(schedule)
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ error: `Internal server error: ${(error as Error).message}` })
  //   }
  // }

  // // 依照選擇的日期和timestamp獲取排程
  // async getScheduleByDateAndTimestamp(req: Request, res: Response) {
  //   const { date, timestamp } = req.params
  //   const schedule = await Schedule.findOne({ date, timestamp })
  //   if (!schedule) {
  //     return res.status(404).json({ message: '找不到此排程' })
  //   }
  //   res.status(200).json(schedule)
  // }

  // // 更新排程
  // async updateSchedule(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params
  //     const scheduleData = req.body as ScheduleData

  //     const schedule = await Schedule.findByIdAndUpdate(id, scheduleData, {
  //       new: true,
  //     })

  //     if (!schedule) {
  //       return res.status(404).json({ message: '找不到此排程' })
  //     }

  //     res.json({ message: '更新成功', data: schedule })
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ error: `更新排程失败: ${(error as Error).message}` })
  //   }
  // }

  // // 依照選擇的日期和timestamp更新排程
  // async updateScheduleByDateAndTimestamp(req: Request, res: Response) {
  //   const { date, timestamp } = req.params
  //   const scheduleData = req.body as ScheduleData
  //   const schedule = await Schedule.findOneAndUpdate(
  //     { date, timestamp },
  //     scheduleData,
  //     { new: true },
  //   )
  //   if (!schedule) {
  //     return res.status(404).json({ message: '找不到此排程' })
  //   }
  //   res.status(200).json({ message: '更新成功', data: schedule })
  // }

  // // 删除排程
  // async deleteSchedule(req: Request, res: Response) {
  //   const { id } = req.params
  //   await Schedule.findByIdAndDelete(id)
  //   res.status(204).send('刪除排程成功')
  // }

  // // 刪除所有排程
  // async deleteAllSchedule(req: Request, res: Response) {
  //   await Schedule.deleteMany({})
  //   res.status(204).send('刪除所有排程成功')
  // }

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
