import noteRepository from '../repositories/note.repository'

import topicRepository from '../repositories/topic.repository'

import { generateNotes } from '../utils/note-generator'

async function generateTopicNotes(topicId: number) {
  const topic = await topicRepository.findTopicById(topicId)

  if (!topic) {
    throw new Error('Topic not found')
  }

  const existingNote = await noteRepository.findNoteByTopicId(topicId)

  if (existingNote) {
    return existingNote
  }

  const startTime = Date.now()
  const content = await generateNotes(topic.name)

  return noteRepository.createNote(topicId, content)
}

async function getNotes(topicId: number) {
  return noteRepository.findNoteByTopicId(topicId)
}

export default {
  generateTopicNotes,
  getNotes
}
