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
    status: number  // 0: normal 1: abnormal
    esHSL: number  // ESS最大功率
    pvEnergy: number  // ESS自排程PV發電量
    esEnergy: number  // ESS自排程ES發電量
    soc: number  // ESS自排程預計電量
  }
}

export interface RealTimeData {
  _id: {
    $oid: string
  }
  status: number
  timestamp: string // Timestamp of the daily record collection
  date: string      // Date of the daily record
  payload: {
    qseId: string
    groupId: number
    date: string
  }
  data: Array<{
    timestamp: string // Timestamp of the individual measurement
    PV_pImm: number
    PV_pDA: number
    PV_raw: number
    genValue_Imm: number
    genValue_DA: number
    soc: number
    version: number
  }>
}