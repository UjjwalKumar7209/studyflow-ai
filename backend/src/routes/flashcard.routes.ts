import express from 'express'

import flashcardController from '../controllers/flashcard.controller'

import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post(
  '/topics/:id/generate-flashcards',
  requireAuth,
  flashcardController.generateFlashcards
)

router.get(
  '/topics/:id/flashcards',
  requireAuth,
  flashcardController.getFlashcards
)

export default router
