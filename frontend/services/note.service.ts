import api from '@/lib/axios'
import type { Note } from '@/types'

export const noteService = {
  async generateNotes(topicId: number): Promise<Note> {
    const res = await api.post(`/topics/${topicId}/generate-notes`)
    return res.data
  },

  async getNotes(topicId: number): Promise<Note | null> {
    const res = await api.get(`/topics/${topicId}/notes`)
    return res.data
  }
}
