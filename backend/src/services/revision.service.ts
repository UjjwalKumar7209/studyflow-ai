import revisionRepository from '../repositories/revision.repository'

import noteRepository from '../repositories/note.repository'

import topicRepository from '../repositories/topic.repository'

import { generateRevision } from '../utils/revision-generator'

async function generateRevisionNotes(userId: number, topicId: number) {
  const existing = await revisionRepository.findRevision(userId, topicId)

  if (existing) {
    return existing
  }

  const topic = await topicRepository.findTopicById(topicId)

  if (!topic) {
    throw new Error('Topic not found')
  }

  const notes = await noteRepository.findNoteByTopicId(topicId)

  if (!notes) {
    throw new Error('Notes not found')
  }

  const startTime = Date.now()
  const content = await generateRevision(topic.name, notes.content)
  console.log(content)


  return revisionRepository.createRevision(userId, topicId, content)
}

async function getRevisions(userId: number) {
  return revisionRepository.getUserRevisions(userId)
}

export default {
  generateRevisionNotes,
  getRevisions
}
