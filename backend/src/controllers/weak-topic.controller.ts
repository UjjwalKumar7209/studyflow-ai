import type { Request, Response } from 'express'

import weakTopicService from '../services/weak-topic.service'

async function analyze(req: Request, res: Response) {
  const result = await weakTopicService.analyzeWeakTopics(req.user!.userId)

  return res.json(result)
}

async function getWeakTopics(req: Request, res: Response) {
  const topics = await weakTopicService.getWeakTopics(req.user!.userId)

  return res.json(topics)
}

export default {
  analyze,
  getWeakTopics
}
