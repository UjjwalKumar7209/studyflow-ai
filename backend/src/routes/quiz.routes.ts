import express from 'express'

import quizController from '../controllers/quiz.controller'

import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post(
  '/topics/:id/generate-quiz',
  requireAuth,
  quizController.generateQuiz
)

router.get('/topics/:id/quiz', requireAuth, quizController.getQuiz)

export default router
