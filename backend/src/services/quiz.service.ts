import quizRepository from '../repositories/quiz.repository'
import noteRepository from '../repositories/note.repository'
import topicRepository from '../repositories/topic.repository'

import { generateQuiz } from '../utils/quiz-generator'

async function generateTopicQuiz(topicId: number) {
  const topic = await topicRepository.findTopicById(topicId)

  if (!topic) {
    throw new Error('Topic not found')
  }

  const existingQuiz = await quizRepository.findQuizzesByTopicId(topicId)

  if (existingQuiz.length > 0) {
    return existingQuiz
  }

  const note = await noteRepository.findNoteByTopicId(topicId)

  if (!note) {
    throw new Error('Generate notes first')
  }

  const startTime = Date.now()
  const quizzes = await generateQuiz(topic.name, note.content)
  const durationMs = Date.now() - startTime


  return quizRepository.createQuizzes(topicId, quizzes)
}

async function getQuiz(topicId: number) {
  return quizRepository.findQuizzesByTopicId(topicId)
}

export default {
  generateTopicQuiz,
  getQuiz
}
