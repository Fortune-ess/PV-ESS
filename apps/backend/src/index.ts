import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'

import { Server as SocketIOServer } from 'socket.io'
import connectDB from './config/mongo'
import AppDataSource from './data-source'
import authRoutes from './routes/authRoute'
import scheduleRoutes from './routes/scheduleRoute'
import userRoutes from './routes/userRoute'
import socketEvent from './socket/socket-event'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// CORS 設定
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 初始化 PostgreSQL 連線
AppDataSource.initialize()
  .then(() => console.log('✅ Database connected'))
  .catch((error: Error) => {
    console.error('❌ Error connecting to database:', error)
    process.exit(1)
  })

const connectMongo = async () => {
  await connectDB({ uri: process.env.MONGO_URI || '' })
}
connectMongo()
  .then(() => console.log('✅ MongoDB connected'))
  .catch((error: Error) => {
    console.error('❌ Error connecting to MongoDB:', error)
    process.exit(1)
  })

const apiPrefix = '/api'
app.use(`${apiPrefix}/auth`, authRoutes)
app.use(`${apiPrefix}/users`, userRoutes)
app.use(`${apiPrefix}/schedule`, scheduleRoutes)

// 創建 HTTP Server 來支援 WebSocket
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
})

// socket connection
socketEvent(io)

server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}/api`)
})
