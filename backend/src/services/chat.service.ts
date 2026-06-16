import chatRepository from '../repositories/chat.repository'

import documentContentRepository from '../repositories/document-content.repository'

import { askDocument } from '../utils/chat-with-document'

async function askQuestion(
  userId: number,
  documentId: number,
  question: string
) {
  const document =
    await documentContentRepository.getDocumentContent(documentId)

  if (!document) {
    throw new Error('Document content not found')
  }

  const startTime = Date.now()
  const answer = await askDocument(document.content, question)
  const durationMs = Date.now() - startTime

  await chatRepository.createChat(userId, documentId, question, answer)

  return {
    question,
    answer
  }
}

async function getChats(documentId: number) {
  return chatRepository.getChats(documentId)
}

export default {
  askQuestion,
  getChats
}
