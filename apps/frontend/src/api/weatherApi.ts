import axios from 'axios'

const weatherApi = {
  getWeather: async () => {
    const response = await axios.get(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-089?Authorization=${import.meta.env.VITE_API_KEY}&LocationName=${import.meta.env.VITE_LOCATION_NAME}&ElementName=`,
    )
    return response
  },
}

export default weatherApi
