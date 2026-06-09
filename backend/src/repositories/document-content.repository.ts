import { eq } from 'drizzle-orm'
import { db } from '../db'
import { documentContentsTable } from '../db/schema'

async function createDocumentContent(documentId: number, content: string) {
  const result = await db
    .insert(documentContentsTable)
    .values({
      documentId,
      content
    })
    .returning()

  return result[0]
}

async function findDocumentContent(documentId: number) {
  const result = await db.select().from(documentContentsTable)

  return result.find((item) => item.documentId === documentId) ?? null
}

async function getDocumentContent(documentId: number) {
  const result = await db
    .select()
    .from(documentContentsTable)
    .where(eq(documentContentsTable.documentId, documentId))

  return result[0] ?? null
}

export default {
  createDocumentContent,
  findDocumentContent,
  getDocumentContent
}
