import { eq } from 'drizzle-orm'
import { db } from '../db'
import { revisionsTable } from '../db/schema'

async function createRevision(
  userId: number,
  topicId: number,
  content: string
) {
  const revision = await db
    .insert(revisionsTable)
    .values({
      userId,
      topicId,
      content
    })
    .returning()

  return revision[0]
}

async function findRevision(userId: number, topicId: number) {
  const revisions = await db
    .select()
    .from(revisionsTable)
    .where(eq(revisionsTable.userId, userId))

  return revisions.find((r) => r.topicId === topicId) ?? null
}

async function getUserRevisions(userId: number) {
  return db
    .select()
    .from(revisionsTable)
    .where(eq(revisionsTable.userId, userId))
}

export default {
  createRevision,
  findRevision,
  getUserRevisions
}
