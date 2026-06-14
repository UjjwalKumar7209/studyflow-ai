import api from '@/lib/axios'
import type { AnalyticsOverview, WeakTopic } from '@/types'

export const analyticsService = {
  async getOverview(): Promise<AnalyticsOverview> {
    const res = await api.get('/analytics/overview')
    return res.data
  },

  async getWeakTopics(): Promise<WeakTopic[]> {
    const res = await api.get('/weak-topics')
    return res.data
  },

  async analyzeWeakTopics(): Promise<WeakTopic[]> {
    const res = await api.post('/weak-topics/analyze')
    return res.data
  }
}
