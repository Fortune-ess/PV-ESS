// Function to fetch real-time data from the store
import { useScheduleStore } from '@/store/useSocketStore'
import type { RealTimeData } from '@/types'

let result: RealTimeData[] = []

// eslint-disable-next-line require-await
export const fetchRealTimeData = async (): Promise<RealTimeData[]> => {
  try {
    const scheduleStore = useScheduleStore()
    result = scheduleStore.realTimeData
    return result
  } catch (error) {
    console.error('Fetching real-time data error:', error)
    return [] as RealTimeData[]
  }
}
