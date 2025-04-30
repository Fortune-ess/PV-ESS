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

// Interface for the flattened structure ready for DB insertion
export interface FlatMeasurement {
  qseId: string
  groupId: number
  measurementDate: string
  timestamp: string
  PV_pImm: number
  PV_pDA: number
  PV_raw: number
  genValue_Imm: number
  genValue_DA: number
  soc: number
  version: number
}