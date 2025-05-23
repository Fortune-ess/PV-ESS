export type StatusType = 'normal' | 'warning' | 'error'
export type BorderColorType =
  | 'border-success'
  | 'border-warning'
  | 'border-danger'

export interface ForecastType {
  time: string
  icon: string
  temperature: string
  precipitation: string
}

export interface ScheduleData {
  qseId: string
  groupId: number
  date: string
  data: {
    dayAheadPrediction: number
    timestamp: Date
    status: number // 0: normal 1: abnormal
    esHSL: number // ESS最大功率
    pvEnergy: number // ESS自排程PV發電量
    esEnergy: number // ESS自排程ES發電量
    soc: number // ESS自排程預計電量
  }
}

export interface RealTimeData {
  _id: string
  timestamp: string
  PV_pDA: number
  PV_pImm: number
  PV_raw: number
  __v: number
  genValue_DA: number
  genValue_Imm: number
  groupId: number
  measurementDate: string
  qseId: string
  soc: number
  version: number
}
