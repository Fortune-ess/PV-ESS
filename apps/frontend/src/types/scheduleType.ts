export interface ScheduleData {
  _id: string
  qseId: string
  groupId: number
  date: string
  data: {
    timestamp: string
    status: number
    esHSL: number
    pvEnergy: number
    esEnergy: number
    soc: number
  }
}
  
export interface RealTimeData {
  status: number
  timestamp: string
  date: string
  payload: {
    qseId: string
    groupId: number
    date: string
  }
  data: {
    timestamp: string
    PV_pImm: number
    PV_pDA: number
    PV_raw: number
    genValue_Imm: number
    genValue_DA: number
    soc: number
    version: number
  }[]
}