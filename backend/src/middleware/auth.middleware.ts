import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt'

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.token

    if (!token) {
      return res.status(401).json({
        msg: 'Unauthorized'
      })
    }

    const payload = verifyToken(token) as {
      userId: number
    }

    req.user = payload

    next()
  } catch {
    return res.status(401).json({
      msg: 'Unauthorized'
    })
  }
}
