import { db } from '../db/index'
import { usersTable } from '../db/schema'
import bcrypt from 'bcrypt'
import userRepository from '../repositories/user.repository'
import { generateToken } from '../utils/jwt'

// register()
async function register(name: string, email: string, password: string) {
  const existingUser = await userRepository.findUserByEmail(email)
  if (existingUser) {
    throw Error('User already exists')
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await userRepository.createUser(name, email, passwordHash)
  return user
}

// login()
async function login(email: string, password: string) {
  const user = await userRepository.findUserByEmail(email)
  if (!user) {
    throw new Error('Invalid credentials')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordCorrect) {
    throw new Error('Invalid credentials')
  }
  const token = generateToken(user.id)
  return {
    token,
    user
  }
}

// me()
async function me(userId: number) {
  const user = await userRepository.findUserById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

const authService = {
  register,
  login,
  me
}

export default authService
