import api from '@/lib/axios'
import type { User } from '@/types'

export const authService = {
  async register(name: string, email: string, password: string): Promise<User> {
    const res = await api.post('/auth/register', { name, email, password })
    return res.data.user
  },

  async login(email: string, password: string): Promise<User> {
    const res = await api.post('/auth/login', { email, password })
    return res.data.user
  },

  async me(): Promise<User> {
    const res = await api.get('/auth/me')
    return res.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  }
}
