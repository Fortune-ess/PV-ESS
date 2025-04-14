import { Server } from 'socket.io'
import Schedule from '../entities/Schedule'

export default function socketEvent(io: Server) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`)

    socket.on('sendMessage', (data) => {
      console.log('Received message:', data)
      io.emit('receiveMessage', data)
    })

    socket.on('scheduleData', (data) => {
      console.log('Received schedule data:', data)
      io.emit('scheduleData', data)
    })

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`)
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  })

  // ✅ 每 1 秒查一次資料並 emit 給所有連線用戶
  setInterval(async () => {
    try {
      const latest = await Schedule.findOne({})
        .sort({ 'data.timestamp': -1 })
        .lean()
      if (latest) {
        io.emit('scheduleData', latest)
      }
    } catch (err) {
      console.error('❌ Failed to fetch latest schedule data:', err)
    }
  }, 1000)
}
