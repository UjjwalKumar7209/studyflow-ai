import { db } from '../db'
import { quizAttemptsTable } from '../db/schema'
import { eq } from 'drizzle-orm'

async function createAttempt(
  userId: number,
  topicId: number,
  totalQuestions: number,
  correctAnswers: number,
  score: number
) {
  const attempt = await db
    .insert(quizAttemptsTable)
    .values({
      userId,
      topicId,
      totalQuestions,
      correctAnswers,
      score
    })
    .returning()

  return attempt[0]
}

async function findAttemptsByUserId(userId: number) {
  return db
    .select()
    .from(quizAttemptsTable)
    .where(eq(quizAttemptsTable.userId, userId))
}

export default {
  createAttempt,
  findAttemptsByUserId
}
