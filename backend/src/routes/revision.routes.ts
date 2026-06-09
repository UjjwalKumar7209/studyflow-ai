import express from 'express'

import revisionController from '../controllers/revision.controller'

import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post(
  '/topics/:id/generate-revision',
  requireAuth,
  revisionController.generate
)

router.get('/revisions', requireAuth, revisionController.getRevisions)

export default router
