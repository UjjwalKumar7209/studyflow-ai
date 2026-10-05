import axios from 'axios'

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const apiBaseUrl = configuredApiUrl.replace(/\/$/, '').endsWith('/api/v1')
  ? configuredApiUrl.replace(/\/$/, '')
  : `${configuredApiUrl.replace(/\/$/, '')}/api/v1`

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
