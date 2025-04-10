import weatherApi from '@/api/weatherApi'
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  Cloudy,
  Sun,
} from 'lucide-vue-next'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useWeatherStore = defineStore('weather', () => {
  // State
  const currentWeather = ref({
    stationName: '',
    weather: '',
    temperature: '',
    observationTime: '',
    countyName: '',
    townName: '',
  })

  const forecasts = ref<
    {
      time: string
      icon: string
      temperature: string
      precipitation: string
    }[]
  >([])

  const currentDateTime = ref(new Date())
  let timer: number | null = null

  // Getters
  const weatherIcon = computed(() => {
    const weather = currentWeather.value.weather
    switch (weather) {
      case '晴':
        return Sun
      case '多雲':
        return Cloudy
      case '陰':
        return Cloud
      case '雨':
        return CloudRain
      case '晴時多雲':
        return CloudSun
      case '短暫陣雨或雷雨':
        return CloudLightning
      case '短暫陣雨':
        return CloudDrizzle
      default:
        return Cloud
    }
  })

  const weatherIconColor = computed(() => {
    const weather = currentWeather.value.weather
    switch (weather) {
      case '晴':
        return 'text-yellow-400'
      case '多雲':
        return 'text-gray-300'
      case '陰':
        return 'text-gray-300'
      case '雨':
        return 'text-blue-400'
      case '晴時多雲':
        return 'text-yellow-300'
      case '短暫陣雨或雷雨':
        return 'text-purple-400'
      case '短暫陣雨':
        return 'text-blue-300'
      default:
        return 'text-gray-300'
    }
  })

  // Actions
  const updateCurrentTime = () => {
    currentDateTime.value = new Date()
  }

  const getFutureTimePoints = () => {
    const timePoints = []
    const now = new Date()
    timePoints.push(new Date(now))
    for (let i = 1; i <= 4; i++) {
      const futureTime = new Date(now)
      futureTime.setHours(now.getHours() + i * 3)
      timePoints.push(futureTime)
    }
    return timePoints
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getForecastIcon = (weather: string) => {
    switch (weather) {
      case '晴':
        return Sun
      case '多雲':
        return Cloudy
      case '陰':
        return Cloud
      case '雨':
        return CloudRain
      case '晴時多雲':
        return CloudSun
      case '短暫陣雨或雷雨':
        return CloudLightning
      case '短暫陣雨':
        return CloudDrizzle
      default:
        return Cloud
    }
  }

  const getForecastIconColor = (weather: string) => {
    switch (weather) {
      case '晴':
        return 'text-yellow-400'
      case '多雲':
        return 'text-gray-300'
      case '陰':
        return 'text-gray-300'
      case '雨':
        return 'text-blue-400'
      case '晴時多雲':
        return 'text-yellow-300'
      case '短暫陣雨或雷雨':
        return 'text-purple-400'
      case '短暫陣雨':
        return 'text-blue-300'
      default:
        return 'text-gray-300'
    }
  }

  const fetchWeatherData = async () => {
    try {
      const response = await weatherApi.getWeather()
      if (response.data.success) {
        const location = response.data.records.Locations[0].Location[0]
        const city = response.data.records.Locations[0].LocationsName
        const district = location.LocationName

        const weatherData = location.WeatherElement.find(
          (el: any) => el.ElementName === '天氣現象',
        )
        const tempData = location.WeatherElement.find(
          (el: any) => el.ElementName === '溫度',
        )
        const rainData = location.WeatherElement.find(
          (el: any) => el.ElementName === '3小時降雨機率',
        )

        if (weatherData) {
          currentWeather.value = {
            stationName: location.LocationName,
            weather: weatherData.Time[0].ElementValue[0].Weather,
            temperature: `${tempData.Time[0].ElementValue[0].Temperature}°C`,
            observationTime: weatherData.Time[0].StartTime,
            countyName: city,
            townName: district,
          }

          const timePoints = getFutureTimePoints()
          forecasts.value = timePoints.map((time, index) => {
            const apiTimeIndex = Math.min(index, weatherData.Time.length - 1)
            return {
              time: formatTime(time),
              icon: weatherData.Time[apiTimeIndex].ElementValue[0].Weather,
              temperature: `${tempData.Time[apiTimeIndex].ElementValue[0].Temperature}°C`,
              precipitation: `降雨機率 ${rainData.Time[apiTimeIndex].ElementValue[0].ProbabilityOfPrecipitation}%`,
            }
          })
        }
      }
    } catch (error) {
      console.error('獲取天氣數據失敗:', error)
    }
  }

  const startTimer = () => {
    updateCurrentTime()
    timer = window.setInterval(updateCurrentTime, 1000)
  }

  const stopTimer = () => {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    currentWeather,
    forecasts,
    currentDateTime,
    weatherIcon,
    weatherIconColor,
    getForecastIcon,
    getForecastIconColor,
    fetchWeatherData,
    startTimer,
    stopTimer,
  }
})
