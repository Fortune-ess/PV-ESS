import { Server } from 'socket.io'
import Schedule from '../entities/Schedule'

export default function socketEvent(io: Server) {

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`)

    // Create Change Stream
    const changeStream = Schedule.watch()

    changeStream.on('change', async (change) => {

      if (['insert', 'update', 'replace'].includes(change.operationType)) {
        const scheduleData = await Schedule.find({ date: '2023-09-30' }).sort({ 'data.timestamp': 1 })
        socket.emit('scheduleData', scheduleData)
      }
    })

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`)
      // changeStream.close()
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  })
}
