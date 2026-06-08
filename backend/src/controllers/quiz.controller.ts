import type { Request, Response } from 'express'

import quizService from '../services/quiz.service'

async function generateQuiz(req: Request, res: Response) {
  try {
    const quiz = await quizService.generateTopicQuiz(Number(req.params.id))

    return res.json(quiz)
  } catch (error) {
    return res.status(400).json({
      msg: error instanceof Error ? error.message : 'Failed'
    })
  }
}

async function getQuiz(req: Request, res: Response) {
  try {
    const quiz = await quizService.getQuiz(Number(req.params.id))

    return res.json(quiz)
  } catch {
    return res.status(500).json({
      msg: 'Failed'
    })
  }
}

export default {
  generateQuiz,
  getQuiz
}
