import express from 'express'

import quizAttemptController from '../controllers/quiz-attempt.controller'

import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post(
  '/topics/:id/submit-quiz',
  requireAuth,
  quizAttemptController.submitQuiz
)

router.get('/quiz-attempts', requireAuth, quizAttemptController.getAttempts)

export default router
