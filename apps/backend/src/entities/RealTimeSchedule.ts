import { Document, Schema, model } from 'mongoose' // Removed Types

// Interface for a single measurement document in the database
export interface MeasurementDocument extends Document {
  qseId: string
  groupId: number
  measurementDate: string // The date the measurement belongs to (e.g., '2023-09-30')
  timestamp: string       // The specific timestamp of this measurement (Keep as String)
  PV_pImm: number
  PV_pDA: number
  PV_raw: number
  genValue_Imm: number
  genValue_DA: number
  soc: number
  version: number
}

// Mongoose Schema for a single measurement
const MeasurementSchema: Schema = new Schema<MeasurementDocument>({
  // --- Metadata copied from the parent document ---
  qseId: { type: String, required: true, index: true },
  groupId: { type: Number, required: true, index: true },
  measurementDate: { type: String, required: true, index: true },

  // --- Measurement specific data ---
  timestamp: { type: String, required: true, index: true, unique: true }, // Keep as String, Index, Unique
  PV_pImm: { type: Number, default: 0 },
  PV_pDA: { type: Number, default: 0 },
  PV_raw: { type: Number, default: 0 },
  genValue_Imm: { type: Number, default: 0 },
  genValue_DA: { type: Number, default: 0 },
  soc: { type: Number, default: 10 },
  version: { type: Number, default: 1 },
})

// Create and export the Mongoose model
export default model<MeasurementDocument>('Measurement', MeasurementSchema, 'PV_R_D_I')