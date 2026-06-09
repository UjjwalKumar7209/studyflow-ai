import express from 'express'

import chatController from '../controllers/chat.controller'

import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/documents/:id/chat', requireAuth, chatController.ask)

router.get('/documents/:id/chat', requireAuth, chatController.history)

export default router
