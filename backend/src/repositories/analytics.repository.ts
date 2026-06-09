import { eq } from 'drizzle-orm'
import { db } from '../db'
import { quizAttemptsTable } from '../db/schema'

async function getAttemptsByUserId(userId: number) {
  return db
    .select()
    .from(quizAttemptsTable)
    .where(eq(quizAttemptsTable.userId, userId))
}

export default {
  getAttemptsByUserId
}
