import type { Request, Response } from 'express'

import analyticsService from '../services/analytics.service'

async function getOverview(req: Request, res: Response) {
  const analytics = await analyticsService.getOverview(req.user!.userId)

  return res.json(analytics)
}

export default {
  getOverview
}
