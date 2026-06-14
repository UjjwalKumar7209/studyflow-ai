import api from '@/lib/axios'
import type { Revision } from '@/types'

export const revisionService = {
  async generateRevision(topicId: number): Promise<Revision> {
    const res = await api.post(`/topics/${topicId}/generate-revision`)
    return res.data
  },

  async getRevisions(): Promise<Revision[]> {
    const res = await api.get('/revisions')
    return res.data
  }
}
