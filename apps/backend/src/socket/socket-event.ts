// eslint-disable-next-line import/no-extraneous-dependencies
import { Server } from 'socket.io'

export default function socketEvent(io: Server) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`)

    socket.on('sendMessage', (data) => {
      console.log('Received message:', data)
      io.emit('receiveMessage', data)
    })

    // monitor schedule data
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
}
