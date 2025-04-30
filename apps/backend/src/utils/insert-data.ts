import scheduleData from '../constants/data.json'
import Schedule from '../entities/Schedule'
import { ScheduleData } from '../types'

let counter = 0
const TOTAL_RECORDS = 96

export async function startDataInsertion() {
  try {
    // 檢查並清空資料庫
    const count = await Schedule.countDocuments()
    if (count > 0) {
      await Schedule.deleteMany({})
    }

    // 設定每秒插入一次資料
    const insertDataWithDelay = async () => {
      try {
        // 如果 counter 達到96，清空資料庫並重置 counter
        if (counter >= TOTAL_RECORDS) {
          await Schedule.deleteMany({})
          counter = 0
        }

        const rawData: ScheduleData = scheduleData[counter]
        await insertData(rawData)
        counter++

        // 在 1 秒後執行下一次資料插入
        setTimeout(insertDataWithDelay, 1000)

      } catch (error) {
        console.error('Error in data insertion:', error)
      }
    }

    // 啟動資料插入
    insertDataWithDelay()
  } catch (error) {
    console.error('Error during initialization:', error)
  }
}

async function insertData(data: ScheduleData) {
  const schedule = new Schedule(data)
  await schedule.save()
}
