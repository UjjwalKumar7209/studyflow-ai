import api from '@/lib/axios'
import type { Topic } from '@/types'

export const topicService = {
  async getTopicsByDocument(documentId: number): Promise<Topic[]> {
    const res = await api.get(`/documents/${documentId}/topics`)
    return res.data
  }
}
