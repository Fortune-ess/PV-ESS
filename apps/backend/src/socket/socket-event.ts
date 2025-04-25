import { Server } from 'socket.io'
import Schedule from '../entities/Schedule'
import Measurement from '../entities/RealTimeSchedule'

export default function socketEvent(io: Server) {

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`)

    // Create Change Stream for Schedule
    const scheduleChangeStream = Schedule.watch()

    scheduleChangeStream.on('change', async (change) => {
      if (['insert', 'update', 'replace'].includes(change.operationType)) {
        const scheduleData = await Schedule.find({ date: '2023-09-30' }).sort({ 'data.timestamp': 1 })
        socket.emit('scheduleData', scheduleData)
      }
    })

    // Create Change Stream for Real-time Measurements
    const measurementChangeStream = Measurement.watch()

    measurementChangeStream.on('change', async (change) => {
      if (['insert', 'update', 'replace'].includes(change.operationType)) {
        const realTimeData = await Measurement.find().sort({ timestamp: 1 })
        socket.emit('realTimeData', realTimeData)
      }
    })

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`)
      scheduleChangeStream.close()
      measurementChangeStream.close()
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  })
}
