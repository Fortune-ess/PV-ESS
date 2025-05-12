import { Document, Schema, model } from 'mongoose'

// Interface for the payload section
interface Payload {
  qseId: string
  groupId: number
  date: string
}

// Interface for a single data point
interface DataPoint {
  timestamp: string
  PV_pImm: number
  PV_pDA: number
  PV_raw: number
  genValue_Imm: number
  genValue_DA: number
  soc: number
  version: number
}

// Interface for real-time data document
export interface RealTimeDataDocument extends Document {
  status: number
  timestamp: string
  date: string
  payload: Payload
  data: DataPoint[]
}

// Schema for a single data point
const DataPointSchema: Schema = new Schema({
  timestamp: { type: String, required: true }, // 時間戳
  PV_pImm: { type: Number, default: 0 }, // 即時PV發電量
  PV_pDA: { type: Number, default: 0 }, // 日前PV預測發電量
  PV_raw: { type: Number, default: 0 }, // 原始PV發電量
  genValue_Imm: { type: Number, default: 0 }, // 即時發電值
  genValue_DA: { type: Number, default: 0 }, // 日前預測發電值
  soc: { type: Number, default: 10 }, // 電池電量
  version: { type: Number, default: 1 }, // 資料版本
})

// Schema for payload
const PayloadSchema: Schema = new Schema({
  qseId: { type: String, required: true }, // 廠商ID
  groupId: { type: Number, required: true }, // 案場ID
  date: { type: String, required: true }, // 日期
})

// Schema for real-time data
const RealTimeDataSchema: Schema = new Schema<RealTimeDataDocument>({
  status: { type: Number, default: 0 }, // 狀態 0: normal
  timestamp: { type: String, required: true, index: true }, // API 呼叫時間戳
  date: { type: String, required: true, index: true }, // 日期
  payload: { type: PayloadSchema, required: true },
  data: [{ type: DataPointSchema, required: true }],
})

export default model<RealTimeDataDocument>('RealTimeData', RealTimeDataSchema, 'PV_R_D_I')
