import { ref, watch } from 'vue'

// 系統狀態
export const useSystemStore = () => {
  // 固定數據
  const frequency = ref(60)
  const powerM1 = ref(2016.72)
  const powerM2 = ref(16.72)
  const powerM3 = ref(2000)
  const solarPower = ref(3150)
  const batteryPower = ref(10000)
  const batteryCapacity = ref(11500)
  const oldPVPower = ref(4000)

  // 狀態
  const status = ref('normal')
  const solarStatus = ref('error')
  const batteryStatus = ref('warning')
  const oldPVStatus = ref('normal')

  // 動畫控制
  const animationStep = ref(0)
  const animationInterval = ref<number | null>(null)
  const animationTriggered = ref(false)
  const currentAnimationSource = ref('')
  const animationInProgress = ref(false)

  // 計算總功率
  const totalPower = ref(0)
  const updateTotalPower = () => {
    totalPower.value = powerM1.value + powerM2.value + powerM3.value
  }

  // 根據狀態獲取邊框顏色
  const getBorderColor = (status: string) => {
    switch (status) {
      case 'warning':
        return 'border-yellow-500'
      case 'error':
        return 'border-red-500'
      default:
        return 'border-green-500'
    }
  }

  // 控制動畫
  const startAnimation = () => {
    if (animationInterval.value) clearInterval(animationInterval.value)

    animationInterval.value = setInterval(() => {
      animationStep.value = (animationStep.value + 1) % 3
    }, 500) as unknown as number
  }

  // 觸發特定路徑的動畫
  const triggerPathAnimation = (source: string) => {
    if (animationInProgress.value) return

    animationInProgress.value = true
    currentAnimationSource.value = source
    animationTriggered.value = true

    setTimeout(() => {
      animationTriggered.value = false
      animationInProgress.value = false
      currentAnimationSource.value = ''
    }, 5000)
  }

  // 監聽狀態變化以觸發動畫
  watch(
    [solarStatus, oldPVStatus, batteryStatus],
    ([newSolar, newOldPV, newBattery], [oldSolar, oldOldPV, oldBattery]) => {
      if (newSolar === 'normal' && oldSolar !== 'normal') {
        triggerPathAnimation('newPV')
      } else if (newOldPV === 'normal' && oldOldPV !== 'normal') {
        triggerPathAnimation('oldPV')
      } else if (newBattery === 'normal' && oldBattery !== 'normal') {
        triggerPathAnimation('battery')
      }
    },
  )

  return {
    // 狀態
    frequency,
    powerM1,
    powerM2,
    powerM3,
    solarPower,
    batteryPower,
    batteryCapacity,
    oldPVPower,
    status,
    solarStatus,
    batteryStatus,
    oldPVStatus,
    totalPower,
    // 動畫相關
    animationStep,
    animationTriggered,
    currentAnimationSource,
    // 方法
    updateTotalPower,
    getBorderColor,
    startAnimation,
    triggerPathAnimation,
  }
}
