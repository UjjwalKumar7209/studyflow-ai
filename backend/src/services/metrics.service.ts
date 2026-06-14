import metricsRepository from '../repositories/metrics.repository'

async function track(key: string) {
  await metricsRepository.incrementMetric(key)
}

async function getMetrics() {
  return metricsRepository.getMetrics()
}

export default {
  track,
  getMetrics
}
