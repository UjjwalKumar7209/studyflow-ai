import express, { type Request, type Response } from 'express'
import authController from '../controllers/auth.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', requireAuth, authController.me)
router.post('/logout', authController.logout)

export default router
