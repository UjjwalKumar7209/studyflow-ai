import type { Request, Response } from 'express'

import chatService from '../services/chat.service'

async function ask(req: Request, res: Response) {
  try {
    const result = await chatService.askQuestion(
      req.user!.userId,
      Number(req.params.id),
      req.body.question
    )

    return res.json(result)
  } catch (error) {
    return res.status(400).json({
      msg: error instanceof Error ? error.message : 'Failed'
    })
  }
}

async function history(req: Request, res: Response) {
  const chats = await chatService.getChats(Number(req.params.id))

  return res.json(chats)
}

export default {
  ask,
  history
}
