import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定義常數類型
interface Constants {
  BSC: number
  UpSoC: number
  LoSoC: number
  PCS: number
  initSoC: number
  date: string
}

// 定義排程數據類型
interface ScheduleItem {
  qseId: string
  groupId: number
  date: string
  data: {
    timestamp: string
    status: number
    esHSL: number
    pvEnergy: number
    esEnergy: number
    soc: number
  }
}

export const useDataStore = defineStore('data', () => {
  // 使用 ref 來存儲數據
  const constants = ref<Constants>({
    BSC: 8.19,
    UpSoC: 0.9,
    LoSoC: 0.2,
    PCS: 3.15,
    initSoC: 1.15,
    date: '2023-09-30',
  })

  // 時間間隔數據
  const timeIntervals = ref<string[]>([
    '00:00',
    '00:15',
    '00:30',
    '00:45',
    '01:00',
    '01:15',
    '01:30',
    '01:45',
    '02:00',
    '02:15',
    '02:30',
    '02:45',
    '03:00',
    '03:15',
    '03:30',
    '03:45',
    '04:00',
    '04:15',
    '04:30',
    '04:45',
    '05:00',
    '05:15',
    '05:30',
    '05:45',
    '06:00',
    '06:15',
    '06:30',
    '06:45',
    '07:00',
    '07:15',
    '07:30',
    '07:45',
    '08:00',
    '08:15',
    '08:30',
    '08:45',
    '09:00',
    '09:15',
    '09:30',
    '09:45',
    '10:00',
    '10:15',
    '10:30',
    '10:45',
    '11:00',
    '11:15',
    '11:30',
    '11:45',
    '12:00',
    '12:15',
    '12:30',
    '12:45',
    '13:00',
    '13:15',
    '13:30',
    '13:45',
    '14:00',
    '14:15',
    '14:30',
    '14:45',
    '15:00',
    '15:15',
    '15:30',
    '15:45',
    '16:00',
    '16:15',
    '16:30',
    '16:45',
    '17:00',
    '17:15',
    '17:30',
    '17:45',
    '18:00',
    '18:15',
    '18:30',
    '18:45',
    '19:00',
    '19:15',
    '19:30',
    '19:45',
    '20:00',
    '20:15',
    '20:30',
    '20:45',
    '21:00',
    '21:15',
    '21:30',
    '21:45',
    '22:00',
    '22:15',
    '22:30',
    '22:45',
    '23:00',
    '23:15',
    '23:30',
    '23:45',
  ])

  // 預測數據
  const predictions = ref({
    dayAhead: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.693, 0, 0, 0, 0, 0, 0,
      0, 29.455, 126.029, 268.847, 613.188, 1407.606, 1880.979, 2358.207, 8000,
      3556.466, 4139.213, 4459.587, 4985.711, 5497.694, 5767.292, 5433.22,
      1260.926, 5065.995, 5136.233, 6867.36, 8000, 6031.644, 4506.713, 6381.57,
      7174.966, 7094.667, 7039.321, 7037.25, 6926.078, 6685.444, 5826.05,
      6122.892, 6188.648, 5829.927, 5766.268, 5203.388, 4829.249, 4393.256,
      3997.591, 3558.45, 2928.78, 2431.402, 1934.77, 1454.762, 845.242, 471.43,
      286.838, 58.359, 0, 0, 0.541, 5.213, 7.184, 7.955, 7.154, 7.052, 6.335,
      5.537, 5.014, 4.716, 4.317, 3.809, 3.729, 3.583, 3.552, 3.441, 6.542,
      7.993, 11.097, 11.588, 8.121, 0, 4.038,
    ],
    immediateUTC8: [
      20.103, 21.396, 23.422, 26.758, 12.918, 16.148, 18.521, 20.68, 23.997,
      34.426, 35.25, 33.55, 32.763, 32.328, 29.167, 27.387, 23.579, 17.915,
      12.427, 9.735, 2.62, 0, 0, 0, 0, 0, 56.209, 623.372, 1364.102, 2005.668,
      2316.357, 3150.818, 3581.999, 4066.342, 4501.801, 5090.295, 5525.843,
      5760.143, 5351.492, 4664.138, 5088.662, 5124.356, 5507.899, 6767.402,
      6067.367, 5563.317, 6444.482, 7209.966, 7175.865, 7372.138, 7075.817,
      6790.269, 6787.493, 5800.052, 6038.996, 6128.82, 5859.027, 5660.332,
      5185.537, 4770.549, 4428.444, 3962.435, 3433.756, 2939.106, 2524.637,
      1964.471, 1455.041, 893.908, 502.352, 260.362, 132.253, 45.913, 0, 34.595,
      22.219, 14.757, 10.18, 5.659, 3.642, 9.094, 8.175, 7.742, 7.712, 8.131,
      8.758, 1.307, 8.668, 8.852, 8.987, 9.075, 9.234, 9.277, 9.144, 9.213,
      8.552, 6.9,
    ],
  })

  // PC比率數據
  const pcRatioDayAhead = ref([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.403, 0.375, 0.338, 0.376, 0.396, 0.413,
    0.432, 0.445, 0.447, 0.444, 0.443, 0.445, 0.445, 0.44, 0.43, 0.418, 0.396,
    0.368, 0.34, 0.316, 0.34, 0.369, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ])

  // 生成從0到充滿電的模擬數據
  const generateScheduleData = () => {
    const data: ScheduleItem[] = []
    const date = '2023-09-30'
    const qseId = '33284077'
    const groupId = 1
    const maxSoC = 11.5 // 最大電量
    const initialSoC = 0.2 // 初始電量

    // 計算每個時間間隔的SOC增量
    const totalIntervals = timeIntervals.value.length
    const socIncrement = (maxSoC - initialSoC) / totalIntervals

    timeIntervals.value.forEach((time, index) => {
      // 計算當前時間的時間戳
      const [hour, minute] = time.split(':').map(Number)
      const timestamp = `${date}T${time}:00`

      // 計算當前SOC值，保留兩位小數
      const currentSoC = Number((initialSoC + socIncrement * index).toFixed(2))

      // 計算PV能量，模擬白天有太陽能
      let pvEnergy = 0
      if (hour >= 6 && hour <= 18) {
        // 模擬日出日落曲線
        const peakHour = 12
        const distanceFromPeak = Math.abs(hour + minute / 60 - peakHour)
        pvEnergy = Number(
          (
            Math.max(0, 5 - distanceFromPeak * 0.8) *
            (1 + Math.random() * 0.5)
          ).toFixed(3),
        )
      }

      // 計算ES能量，正值表示放電，負值表示充電
      let esEnergy = 0
      if (hour >= 6 && hour <= 18) {
        // 白天主要充電
        esEnergy = Number((-0.8 - Math.random() * 0.5).toFixed(3))
      } else if (hour >= 19 || hour <= 5) {
        // 晚上可能放電
        esEnergy = Number((0.5 + Math.random() * 0.8).toFixed(3))
      }

      data.push({
        qseId,
        groupId,
        date,
        data: {
          timestamp,
          status: 0,
          esHSL: 3.15,
          pvEnergy,
          esEnergy,
          soc: currentSoC,
        },
      })
    })

    return data
  }

  // 排程數據 - 使用生成的模擬數據
  const scheduleData = ref<ScheduleItem[]>(generateScheduleData())

  // 生成另一組從充滿電到放電的模擬數據
  const generateDischargeData = (startDate: string) => {
    const data: ScheduleItem[] = []
    const qseId = '33284077'
    const groupId = 1
    const maxSoC = 11.5 // 最大電量
    const finalSoC = 0.5 // 最終電量

    // 計算每個時間間隔的SOC減量
    const totalIntervals = timeIntervals.value.length
    const socDecrement = (maxSoC - finalSoC) / totalIntervals

    timeIntervals.value.forEach((time, index) => {
      // 計算當前時間的時間戳
      const [hour, minute] = time.split(':').map(Number)
      const timestamp = `${startDate}T${time}:00`

      // 計算當前SOC值，保留兩位小數
      const currentSoC = Number((maxSoC - socDecrement * index).toFixed(2))

      // 計算PV能量，模擬白天有太陽能
      let pvEnergy = 0
      if (hour >= 6 && hour <= 18) {
        // 模擬日出日落曲線
        const peakHour = 12
        const distanceFromPeak = Math.abs(hour + minute / 60 - peakHour)
        pvEnergy = Number(
          (
            Math.max(0, 4 - distanceFromPeak * 0.7) *
            (1 + Math.random() * 0.4)
          ).toFixed(3),
        )
      }

      // 計算ES能量，正值表示放電，負值表示充電
      let esEnergy = 0
      if (hour >= 10 && hour <= 15) {
        // 中午主要放電
        esEnergy = Number((1.2 + Math.random() * 0.8).toFixed(3))
      } else if ((hour >= 19 && hour <= 23) || (hour >= 0 && hour <= 5)) {
        // 晚上和凌晨可能充電
        esEnergy = Number((-0.6 - Math.random() * 0.4).toFixed(3))
      }

      data.push({
        qseId,
        groupId,
        date: startDate,
        data: {
          timestamp,
          status: 0,
          esHSL: 3.15,
          pvEnergy,
          esEnergy,
          soc: currentSoC,
        },
      })
    })

    return data
  }

  // 獲取特定日期的排程數據
  const getScheduleByDate = (date: string) => {
    return scheduleData.value.filter((item) => item.date === date)
  }

  // 獲取特定時間間隔的PV能量數據
  const getPvEnergyData = () => {
    return scheduleData.value.map((item) => item.data.pvEnergy)
  }

  // 獲取特定時間間隔的ES能量數據
  const getEsEnergyData = () => {
    return scheduleData.value.map((item) => item.data.esEnergy)
  }

  // 獲取特定時間間隔的SOC數據
  const getSocData = () => {
    return scheduleData.value.map((item) => item.data.soc)
  }

  // 更新排程數據
  const updateScheduleData = (newScheduleData: ScheduleItem[]) => {
    scheduleData.value = newScheduleData
  }

  // 獲取指定日期的模擬數據
  const getSimulatedDataForDate = (
    date: string,
    isCharging: boolean = true,
  ) => {
    if (isCharging) {
      return generateScheduleData().map((item) => ({ ...item, date }))
    } else {
      return generateDischargeData(date)
    }
  }

  return {
    constants,
    timeIntervals,
    predictions,
    pcRatioDayAhead,
    scheduleData,
    getScheduleByDate,
    getPvEnergyData,
    getEsEnergyData,
    getSocData,
    updateScheduleData,
    getSimulatedDataForDate,
  }
})
