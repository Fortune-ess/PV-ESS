// Function to fetch data from the API
import { useScheduleStore } from '@/store/useSocketStore'
import type { ScheduleData } from '@/types'

let result: ScheduleData[] = []

// eslint-disable-next-line require-await
export const fetchData = async (): Promise<ScheduleData[]> => {
  try {
    const scheduleStore = useScheduleStore()
    result = scheduleStore.scheduleData
    return result
  } catch (error) {
    console.error('Fetching data error:', error)
    return [] as ScheduleData[]
  }
}
