import express from 'express'

import weakTopicController from '../controllers/weak-topic.controller'

import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/weak-topics/analyze', requireAuth, weakTopicController.analyze)
router.get('/weak-topics', requireAuth, weakTopicController.getWeakTopics)

export default router
