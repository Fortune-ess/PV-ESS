// eslint-disable-next-line import/no-extraneous-dependencies
import { io, Socket } from 'socket.io-client'

const socket: Socket = io('http://localhost:3000', {
  withCredentials: false,
})

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('receiveMessage', (data) => {
  console.log('Received message:', data)
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

socket.emit('sendMessage', 'Hello, server!')

export default socket
