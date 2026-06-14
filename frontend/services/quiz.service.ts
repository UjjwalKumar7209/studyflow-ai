import api from '@/lib/axios'
import type { QuizQuestion, QuizAttempt } from '@/types'

export interface SubmitQuizResponse {
  attempt: QuizAttempt
  totalQuestions: number
  correctAnswers: number
  score: number
}

export const quizService = {
  async generateQuiz(topicId: number): Promise<QuizQuestion[]> {
    const res = await api.post(`/topics/${topicId}/generate-quiz`)
    return res.data
  },

  async getQuiz(topicId: number): Promise<QuizQuestion[]> {
    const res = await api.get(`/topics/${topicId}/quiz`)
    return res.data
  },

  async submitQuiz(
    topicId: number,
    answers: Array<{ quizId: number; selectedAnswer: string }>
  ): Promise<SubmitQuizResponse> {
    const res = await api.post(`/topics/${topicId}/submit-quiz`, { answers })
    return res.data
  },

  async getAttempts(): Promise<QuizAttempt[]> {
    const res = await api.get('/quiz-attempts')
    return res.data
  }
}
