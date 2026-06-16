import type { Request, Response } from 'express'

import metricsService from '../services/metrics.service'

async function getMetrics(req: Request, res: Response) {
  const metrics = await metricsService.getMetrics()

  return res.json(metrics)
}

async function getDashboard(req: Request, res: Response) {
  const dashboard = await metricsService.getDashboard()

  return res.json(dashboard)
}

export default {
  getMetrics,
  getDashboard
}
