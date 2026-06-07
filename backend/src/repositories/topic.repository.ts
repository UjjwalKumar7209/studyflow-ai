import { eq } from 'drizzle-orm'
import { db } from '../db'
import { topicsTable } from '../db/schema'

async function createTopics(documentId: number, topics: string[]) {
  return db.insert(topicsTable).values(
    topics.map((topic) => ({
      documentId,
      name: topic
    }))
  )
}

async function getTopics(documentId: number) {
  return db
    .select()
    .from(topicsTable)
    .where(eq(topicsTable.documentId, documentId))
}

export default {
  createTopics,
  getTopics
}
