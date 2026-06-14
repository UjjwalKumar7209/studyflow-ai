import api from '@/lib/axios'
import type { ChatMessage } from '@/types'

export const chatService = {
  async askQuestion(documentId: number, question: string): Promise<ChatMessage> {
    const res = await api.post(`/documents/${documentId}/chat`, { question })
    return res.data
  },

  async getChatHistory(documentId: number): Promise<ChatMessage[]> {
    const res = await api.get(`/documents/${documentId}/chat`)
    return res.data
  }
}
