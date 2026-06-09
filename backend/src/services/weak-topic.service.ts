import analyticsRepository from '../repositories/analytics.repository'

import weakTopicRepository from '../repositories/weak-topic.repository'

async function analyzeWeakTopics(userId: number) {
  const attempts = await analyticsRepository.getAttemptsByUserId(userId)

  const grouped = new Map<number, number[]>()

  for (const attempt of attempts) {
    const scores = grouped.get(attempt.topicId) ?? []

    scores.push(attempt.score)

    grouped.set(attempt.topicId, scores)
  }

  for (const [topicId, scores] of grouped) {
    const averageScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    )

    const weaknessScore = 100 - averageScore

    await weakTopicRepository.upsertWeakTopic(
      userId,
      topicId,
      averageScore,
      weaknessScore
    )
  }

  return weakTopicRepository.getWeakTopics(userId)
}

async function getWeakTopics(userId: number) {
  return weakTopicRepository.getWeakTopics(userId)
}

export default {
  analyzeWeakTopics,
  getWeakTopics
}
