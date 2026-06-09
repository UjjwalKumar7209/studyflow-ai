import { eq } from 'drizzle-orm'
import { db } from '../db'
import { weakTopicsTable } from '../db/schema'

async function upsertWeakTopic(
  userId: number,
  topicId: number,
  averageScore: number,
  weaknessScore: number
) {
  const existing = await db
    .select()
    .from(weakTopicsTable)
    .where(eq(weakTopicsTable.userId, userId))

  const match = existing.find((item) => item.topicId === topicId)

  if (match) {
    return db
      .update(weakTopicsTable)
      .set({
        averageScore,
        weaknessScore
      })
      .where(eq(weakTopicsTable.id, match.id))
  }

  return db.insert(weakTopicsTable).values({
    userId,
    topicId,
    averageScore,
    weaknessScore
  })
}

async function getWeakTopics(userId: number) {
  return db
    .select()
    .from(weakTopicsTable)
    .where(eq(weakTopicsTable.userId, userId))
}

export default {
  upsertWeakTopic,
  getWeakTopics
}
