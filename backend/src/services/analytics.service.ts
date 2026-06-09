import analyticsRepository from '../repositories/analytics.repository'

async function getOverview(userId: number) {
  const attempts = await analyticsRepository.getAttemptsByUserId(userId)

  const totalAttempts = attempts.length

  const averageScore =
    totalAttempts === 0
      ? 0
      : Math.round(
          attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
            totalAttempts
        )

  const bestScore =
    totalAttempts === 0
      ? 0
      : Math.max(...attempts.map((attempt) => attempt.score))

  const totalQuestionsAnswered = attempts.reduce(
    (sum, attempt) => sum + attempt.totalQuestions,
    0
  )

  return {
    totalAttempts,
    averageScore,
    bestScore,
    totalQuestionsAnswered
  }
}

export default {
  getOverview
}
