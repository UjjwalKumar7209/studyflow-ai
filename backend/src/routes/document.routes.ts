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

export default router
