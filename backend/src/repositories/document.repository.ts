import { eq } from 'drizzle-orm'
import { db } from '../db'
import { documentsTable } from '../db/schema'

async function createDocument(
  userId: number,
  title: string,
  originalFileName: string,
  fileType: string,
  fileSize: number,
  storagePath: string
) {
  const document = await db
    .insert(documentsTable)
    .values({
      userId,
      title,
      originalFileName,
      fileType,
      fileSize,
      storagePath,
      status: 'UPLOADED'
    })
    .returning()

  return document[0]
}

async function findDocumentsByUserId(userId: number) {
  const documents = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.userId, userId))
  return documents
}

async function findDocumentById(documentId: number) {
  const documents = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.id, documentId))

  return documents[0] ?? null
}

async function updateDocumentStatus(documentId: number, status: string) {
  const document = await db
    .update(documentsTable)
    .set({
      status,
      updatedAt: new Date()
    })
    .where(eq(documentsTable.id, documentId))
    .returning()

  return document[0]
}

export default {
  createDocument,
  findDocumentsByUserId,
  findDocumentById,
  updateDocumentStatus
}
