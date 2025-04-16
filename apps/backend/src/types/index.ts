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
