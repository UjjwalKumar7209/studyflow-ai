import { eq } from 'drizzle-orm'
import { db } from '../db'
import { quizzesTable } from '../db/schema'

async function createQuizzes(topicId: number, quizzes: any[]) {
  return db
    .insert(quizzesTable)
    .values(
      quizzes.map((quiz) => ({
        topicId,
        question: quiz.question,
        optionA: quiz.options[0],
        optionB: quiz.options[1],
        optionC: quiz.options[2],
        optionD: quiz.options[3],
        correctAnswer: quiz.correctAnswer
      }))
    )
    .returning()
}

async function findQuizzesByTopicId(topicId: number) {
  return db.select().from(quizzesTable).where(eq(quizzesTable.topicId, topicId))
}

export default {
  createQuizzes,
  findQuizzesByTopicId
}
