import express from 'express'

import noteController from '../controllers/note.controller'

import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post(
  '/topics/:id/generate-notes',
  requireAuth,
  noteController.generateNotes
)

router.get('/topics/:id/notes', requireAuth, noteController.getNotes)

export default router
