export interface User {
  id: number
  name: string
  email: string
}

export interface Document {
  id: number
  userId: number
  title: string
  originalFileName: string
  fileType: string
  fileSize: number
  storagePath: string
  status: 'PENDING' | 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
}

export interface DocumentContent {
  id: number
  documentId: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface Topic {
  id: number
  documentId: number
  name: string
  createdAt: string
}

export interface Note {
  id: number
  topicId: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface Flashcard {
  id: number
  topicId: number
  question: string
  answer: string
  createdAt: string
}

export interface QuizQuestion {
  id: number
  topicId: number
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  createdAt: string
}

export interface QuizAttempt {
  id: number
  userId: number
  topicId: number
  totalQuestions: number
  correctAnswers: number
  score: number
  createdAt: string
  topicName?: string
}

export interface WeakTopic {
  id: number
  userId: number
  topicId: number
  averageScore: number
  weaknessScore: number
  updatedAt: string
  topicName?: string // Populated by mapping client-side
}

export interface Revision {
  id: number
  userId: number
  topicId: number
  content: string
  createdAt: string
  topicName?: string // Populated by mapping client-side
}

export interface ChatMessage {
  id: number
  userId: number
  documentId: number
  question: string
  answer: string
  createdAt: string
}

export interface AnalyticsOverview {
  totalAttempts: number
  averageScore: number
  bestScore: number
  totalQuestionsAnswered: number
}
