import express from 'express'

import analyticsController from '../controllers/analytics.controller'

import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.get('/analytics/overview', requireAuth, analyticsController.getOverview)

export default router
