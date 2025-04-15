// composables/useSocket.ts
import { useAuthStore } from '@/store/auth'
import { useScheduleStore } from '@/store/useSocketStore'
import { ScheduleData } from '@/types'
import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

const socket = ref<Socket | null>(null)
const scheduleData = ref<ScheduleData[]>([])
const lastTimestamp = ref<Date | null>(null)

export function connectSocket() {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || socket.value) return

    socket.value = io(`${import.meta.env.VITE_API_URL}`, {
        autoConnect: true,
        withCredentials: true,
    })

    socket.value.on('connect', () => {
        console.log('✅ Socket connected:', socket.value?.id)
    })

    socket.value.on('scheduleData', (data: ScheduleData[]) => {
        const scheduleStore = useScheduleStore()

        // 檢查是否為新的資料
        const currentTimestamp = data[0]?.data?.timestamp
        if (currentTimestamp && (!lastTimestamp.value || currentTimestamp.getTime() !== lastTimestamp.value.getTime())) {
            lastTimestamp.value = currentTimestamp
            scheduleStore.setScheduleData(data)
            console.log('New schedule data received:')
            scheduleStore.scheduleData.forEach((item) => {
                console.log(item.data.timestamp)
            })
        }
    })

    socket.value.on('disconnect', () => {
        console.log('❌ Socket disconnected')
    })

    socket.value.on('error', (error) => {
        console.error('Socket error:', error)
    })
}

export function disconnectSocket() {
    if (socket.value) {
        socket.value.disconnect()
        socket.value = null
        console.log('🔌 Socket manually disconnected')
    }
}

export { scheduleData, socket }
