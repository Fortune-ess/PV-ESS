// composables/useSocket.ts
import { useAuthStore } from '@/store/auth'
import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

const socket = ref<Socket | null>(null)
const scheduleData = ref({})


export function connectSocket() {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || socket.value) return

    socket.value = io('http://localhost:3000', {
        autoConnect: true,
        withCredentials: true,
    })

    socket.value.on('connect', () => {
        console.log('✅ Socket connected:', socket.value?.id)
    })

    socket.value.on('scheduleData', (data) => {
        scheduleData.value = data
        console.log('📡 收到 scheduleData:', data)
    })

    socket.value.on('disconnect', () => {
        console.log('❌ Socket disconnected')
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
