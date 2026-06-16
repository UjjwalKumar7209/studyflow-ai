import flashcardRepository from '../repositories/flashcard.repository'
import noteRepository from '../repositories/note.repository'
import topicRepository from '../repositories/topic.repository'
import { generateFlashcards } from '../utils/flashcard-generator'

async function generateTopicFlashcards(topicId: number) {
  const topic = await topicRepository.findTopicById(topicId)

  if (!topic) {
    throw new Error('Topic not found')
  }

  const existing = await flashcardRepository.findFlashcardsByTopicId(topicId)

  if (existing.length > 0) {
    return existing
  }

  const note = await noteRepository.findNoteByTopicId(topicId)

  if (!note) {
    throw new Error('Generate notes first')
  }

  const startTime = Date.now()
  const flashcards = await generateFlashcards(topic.name, note.content)

  return flashcardRepository.createFlashcards(topicId, flashcards)
}

async function getFlashcards(topicId: number) {
  return flashcardRepository.findFlashcardsByTopicId(topicId)
}

export default {
  generateTopicFlashcards,
  getFlashcards
}
