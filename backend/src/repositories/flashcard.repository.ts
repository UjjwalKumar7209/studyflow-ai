import { eq } from 'drizzle-orm'
import { db } from '../db'
import { flashcardsTable } from '../db/schema'

async function createFlashcards(
  topicId: number,
  flashcards: {
    question: string
    answer: string
  }[]
) {
  return db
    .insert(flashcardsTable)
    .values(
      flashcards.map((card) => ({
        topicId,
        question: card.question,
        answer: card.answer
      }))
    )
    .returning()
}

async function findFlashcardsByTopicId(topicId: number) {
  return db
    .select()
    .from(flashcardsTable)
    .where(eq(flashcardsTable.topicId, topicId))
}

export default {
  createFlashcards,
  findFlashcardsByTopicId
}
