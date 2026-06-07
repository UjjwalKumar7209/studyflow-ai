import type { Request, Response } from 'express'
import { registerSchema } from '../../validators/register.schema'
import authService from '../services/auth.service'
import { loginSchema } from '../../validators/login.schema'

async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body
    const parsed = registerSchema.safeParse({ name, email, password })
    if (!parsed.success) {
      return res.status(400).json({
        msg: 'Invalid inputs'
      })
    }
    const user = await authService.register(name, email, password)
    return res.status(201).json({
      msg: 'User created',
      user
    })
  } catch (error) {
    return res.status(409).json({
      msg: error instanceof Error ? error.message : 'Something went wrong'
    })
  }
}

async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      return res.status(400).json({
        msg: 'Invalid inputs'
      })
    }
    const { token, user } = await authService.login(email, password)
    res.cookie('token', token, {
      httpOnly: true
    })

    return res.status(200).json({
      msg: 'Logged in',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    return res.status(401).json({
      msg: error instanceof Error ? error.message : 'Something went wrong'
    })
  }
}

async function me(req: Request, res: Response) {
  try {
    const user = await authService.me(req.user!.userId)
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  } catch (error) {
    return res.status(404).json({
      msg: error instanceof Error ? error.message : 'Something went wrong'
    })
  }
}

async function logout(req: Request, res: Response) {
  res.clearCookie('token')

  return res.status(200).json({
    msg: 'Logged out'
  })
}

const authController = {
  register,
  login,
  me,
  logout
}

export default authController
