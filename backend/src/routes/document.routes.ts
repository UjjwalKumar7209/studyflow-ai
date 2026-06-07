import express from 'express'
import documentController from '../controllers/document.controller'
import upload from '../config/multer'
import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post(
  '/upload',
  requireAuth,
  upload.single('file'),
  documentController.upload
)

router.get('/', requireAuth, documentController.getDocuments)
router.get('/:id', requireAuth, documentController.getDocument)
router.post('/:id/process', requireAuth, documentController.processDocument)
router.get('/:id/status', requireAuth, documentController.getStatus)
router.get('/:id/content', requireAuth, documentController.getContent)
router.get('/:id/topics', requireAuth, documentController.getTopics)

export default router
