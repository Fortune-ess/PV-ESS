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
