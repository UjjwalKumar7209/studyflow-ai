import { eq } from 'drizzle-orm'
import { db } from '../db'
import { notesTable } from '../db/schema'

async function createNote(topicId: number, content: string) {
  const note = await db
    .insert(notesTable)
    .values({
      topicId,
      content
    })
    .returning()

  return note[0]
}

async function findNoteByTopicId(topicId: number) {
  const notes = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.topicId, topicId))

  return notes[0] ?? null
}

export default {
  createNote,
  findNoteByTopicId
}
