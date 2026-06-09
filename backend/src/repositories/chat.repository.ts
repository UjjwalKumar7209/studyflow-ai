import { eq } from 'drizzle-orm'
import { db } from '../db'
import { chatsTable } from '../db/schema'

async function createChat(
  userId: number,
  documentId: number,
  question: string,
  answer: string
) {
  const chat = await db
    .insert(chatsTable)
    .values({
      userId,
      documentId,
      question,
      answer
    })
    .returning()

  return chat[0]
}

async function getChats(documentId: number) {
  return db
    .select()
    .from(chatsTable)
    .where(eq(chatsTable.documentId, documentId))
}

export default {
  createChat,
  getChats
}
