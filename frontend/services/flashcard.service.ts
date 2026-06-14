import api from '@/lib/axios'
import type { Flashcard } from '@/types'

export const flashcardService = {
  async generateFlashcards(topicId: number): Promise<Flashcard[]> {
    const res = await api.post(`/topics/${topicId}/generate-flashcards`)
    return res.data
  },

  async getFlashcards(topicId: number): Promise<Flashcard[]> {
    const res = await api.get(`/topics/${topicId}/flashcards`)
    return res.data
  }
}
