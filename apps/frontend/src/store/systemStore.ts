import { fetchRealTimeData } from '@/services/fetch-realtime-data'
import type { RealTimeData } from '@/types'
import { ref, watch } from 'vue'

// 系統狀態
export const useSystemStore = () => {

  // 固定數據
  const frequency = ref(60)
  const solarPower = ref(0)
  const batteryPower = ref(0)
  const oldPVPower = ref(4000)

  // 狀態
  const status = ref('normal')
  const solarStatus = ref('error')
  const batteryStatus = ref('normal')
  const oldPVStatus = ref('normal')

  // 動畫控制
  const animationStep = ref(0)
  const animationInterval = ref<number | null>(null)
  const animationTriggered = ref(false)
  const currentAnimationSource = ref('')
  const animationInProgress = ref(false)

  // 計算總功率
  const totalPower = ref(0)

  // 用於存儲處理過的數據
  let lastProcessedData: RealTimeData[] = []

  // 獲取 socData
  const getSocData = async () => {
    const realTimeData = await fetchRealTimeData()

    // 檢查數據是否有變化
    if (realTimeData.length === lastProcessedData.length &&
      JSON.stringify(realTimeData) === JSON.stringify(lastProcessedData)) {
      return
    }

    lastProcessedData = JSON.parse(JSON.stringify(realTimeData))

    // 初始化數據陣列
    const socData: number[] = Array(96).fill(0) // 初始化為96個0，對應每15分鐘一個時間點

    const timeToIndexMap: { [key: string]: number } = {
      '2023-09-30T09:00:00+08:00': 36, // 09:00 對應 timeLabels 中的索引
      '2023-09-30T09:15:00+08:00': 37,
      '2023-09-30T09:30:00+08:00': 38,
      '2023-09-30T09:45:00+08:00': 39,
      '2023-09-30T10:00:00+08:00': 40,
      '2023-09-30T10:15:00+08:00': 41,
      '2023-09-30T10:30:00+08:00': 42,
      '2023-09-30T10:45:00+08:00': 43,
      '2023-09-30T11:00:00+08:00': 44,
      '2023-09-30T11:15:00+08:00': 45,
      '2023-09-30T11:30:00+08:00': 46,
      '2023-09-30T11:45:00+08:00': 47,
      '2023-09-30T12:00:00+08:00': 48,
      '2023-09-30T12:15:00+08:00': 49,
      '2023-09-30T12:30:00+08:00': 50,
      '2023-09-30T12:45:00+08:00': 51,
      '2023-09-30T13:00:00+08:00': 52,
      '2023-09-30T13:15:00+08:00': 53,
      '2023-09-30T13:30:00+08:00': 54,
      '2023-09-30T13:45:00+08:00': 55,
      '2023-09-30T14:00:00+08:00': 56,
      '2023-09-30T14:15:00+08:00': 57
    };

    // 係數映射
    const coefficientMap: { [key: string]: number } = {
      '2023-09-30T09:00:00+08:00': 0.4,
      '2023-09-30T09:15:00+08:00': 0.81,
      '2023-09-30T09:30:00+08:00': 0.45,
      '2023-09-30T09:45:00+08:00': 0.41,
      '2023-09-30T10:00:00+08:00': 0.43,
      '2023-09-30T10:15:00+08:00': 0.64,
      '2023-09-30T10:30:00+08:00': 0.71,
      '2023-09-30T10:45:00+08:00': 0.54,
      '2023-09-30T11:00:00+08:00': 0.39,
      '2023-09-30T11:15:00+08:00': 0.36,
      '2023-09-30T11:30:00+08:00': 0.46,
      '2023-09-30T11:45:00+08:00': 0.49,
      '2023-09-30T12:00:00+08:00': 0.44,
      '2023-09-30T12:15:00+08:00': 0.45,
      '2023-09-30T12:30:00+08:00': 0.54,
      '2023-09-30T12:45:00+08:00': 0.97,
      '2023-09-30T13:00:00+08:00': 1.00,
      '2023-09-30T13:15:00+08:00': 0.76,
      '2023-09-30T13:30:00+08:00': 0.57,
      '2023-09-30T13:45:00+08:00': 0.55,
      '2023-09-30T14:00:00+08:00': 0.42,
      '2023-09-30T14:15:00+08:00': 0.34
    };

    for (let i = 0; i < realTimeData.length; i++) {
      const timestamp = realTimeData[i]?.timestamp;

      if (timestamp && timeToIndexMap[timestamp] !== undefined) {
        const index = timeToIndexMap[timestamp];
        const coefficient = coefficientMap[timestamp];

        if (i > 0) {
          socData[index] = (((realTimeData[i - 1]?.PV_raw + realTimeData[i]?.PV_raw) * 1 / 4) / 2) * coefficient || 0;
        } else {
          socData[index] = (realTimeData[i]?.PV_raw * 1 / 4) * coefficient || 0;
        }
      }
    }

    // 更新 batteryPower 為最新的 socData 值
    const latestSocValue = socData.filter(value => value > 0).pop();

    // 檢查是否到達最後的時間點 (14:15)
    const lastTimestamp = realTimeData[realTimeData.length - 1]?.timestamp;
    if (lastTimestamp === '2023-09-30T23:45:00+08:00') {
      batteryPower.value = 0; // 當到達最後時間點時歸零
    } else if (latestSocValue) {
      batteryPower.value = Number(latestSocValue.toFixed(2));
    }
  }

  // 初始化時獲取數據
  getSocData();

  // 定期更新數據
  setInterval(() => {
    getSocData();
  }, 1000);

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
    solarPower,
    batteryPower,
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
    getBorderColor,
    startAnimation,
    triggerPathAnimation
  }
}
