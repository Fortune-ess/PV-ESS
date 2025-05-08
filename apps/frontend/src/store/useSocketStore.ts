import { RealTimeData, ScheduleData } from '@/types'
import { defineStore } from 'pinia'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    scheduleData: [] as ScheduleData[],
    realTimeData: [] as RealTimeData[],
  }),
  actions: {
    setScheduleData(data: ScheduleData[]) {
      this.scheduleData = data
    },
    setRealTimeData(data: RealTimeData[]) {
      this.realTimeData = data
    },
  },
})
