import { Schema, model } from 'mongoose'

// eslint-disable-next-line @typescript-eslint/naming-convention
const ScheduleSchema: Schema = new Schema({
  // 日前排程API schema
  qseId: { type: String, required: true }, // 廠商ID
  groupId: { type: Number, required: true }, // 案場ID
  date: { type: String, required: true }, // 排程日期
  data: {
    type: {
      timestamp: { type: Date, required: true }, // 排程時間戳
      status: { type: Number, default: 0 }, // ESS狀態 0: normal 1: abnormal
      esHSL: { type: Number, required: true }, // ESS最大功率
      pvEnergy: { type: Number, default: 0 }, // ESS自排程PV發電量
      esEnergy: { type: Number, default: 0 }, // ESS自排程ES發電量
      soc: { type: Number, required: true }, // ESS自排程預計電量
    },
    required: true,
  },
})

export default model('Schedule', ScheduleSchema, 'schedule_DA')
