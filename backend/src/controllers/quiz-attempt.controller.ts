import type { Request, Response } from 'express'

import quizAttemptService from '../services/quiz-attempt.service'

async function submitQuiz(req: Request, res: Response) {
  try {
    const result = await quizAttemptService.submitQuiz(
      req.user!.userId,
      Number(req.params.id),
      req.body.answers
    )

    return res.json(result)
  } catch (error) {
    return res.status(400).json({
      msg: error instanceof Error ? error.message : 'Failed'
    })
  }
}

async function getAttempts(req: Request, res: Response) {
  const attempts = await quizAttemptService.getAttempts(req.user!.userId)

  return res.json(attempts)
}

export default {
  submitQuiz,
  getAttempts
}
