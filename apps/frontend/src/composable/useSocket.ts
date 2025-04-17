// composables/useSocket.ts
import { useAuthStore } from '@/store/auth'
import { useScheduleStore } from '@/store/useSocketStore'
import { ScheduleData } from '@/types'
import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

const socket = ref<Socket | null>(null)
const scheduleData = ref<ScheduleData[]>([])

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
        try {
            const scheduleStore = useScheduleStore()
            scheduleStore.setScheduleData(data)
        } catch (error) {
            console.error('Error processing schedule data:', error)
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
