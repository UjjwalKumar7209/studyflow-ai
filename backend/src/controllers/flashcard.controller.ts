import type { Request, Response } from 'express'

import flashcardService from '../services/flashcard.service'

async function generateFlashcards(req: Request, res: Response) {
  try {
    const flashcards = await flashcardService.generateTopicFlashcards(
      Number(req.params.id)
    )

    return res.json(flashcards)
  } catch (error) {
    return res.status(400).json({
      msg: error instanceof Error ? error.message : 'Failed'
    })
  }
}

async function getFlashcards(req: Request, res: Response) {
  const flashcards = await flashcardService.getFlashcards(Number(req.params.id))

  return res.json(flashcards)
}

export default {
  generateFlashcards,
  getFlashcards
}
