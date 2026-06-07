import documentRepository from '../repositories/document.repository'
import { extractTextFromPdf } from '../utils/pdf-parser'

import documentContentRepository from '../repositories/document-content.repository'

async function uploadDocument(userId: number, file: Express.Multer.File) {
  const document = await documentRepository.createDocument(
    userId,
    file.originalname,
    file.originalname,
    file.mimetype,
    file.size,
    file.path
  )

  return document
}

async function getDocuments(userId: number) {
  return documentRepository.findDocumentsByUserId(userId)
}

async function getDocument(documentId: number, userId: number) {
  const document = await documentRepository.findDocumentById(documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  if (document.userId !== userId) {
    throw new Error('Unauthorized')
  }

  return document
}

async function processDocument(documentId: number, userId: number) {
  const document = await documentRepository.findDocumentById(documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  if (document.userId !== userId) {
    throw new Error('Unauthorized')
  }

  await documentRepository.updateDocumentStatus(documentId, 'PROCESSING')
  const extractedText = await extractTextFromPdf(document.storagePath)
  await documentContentRepository.createDocumentContent(
    document.id,
    extractedText
  )
  const updatedDocument = await documentRepository.updateDocumentStatus(
    documentId,
    'COMPLETED'
  )

  return updatedDocument
}

async function getContent(documentId: number, userId: number) {
  const document = await getDocument(documentId, userId)

  const content = await documentContentRepository.findDocumentContent(
    document.id
  )

  return content
}

export default {
  uploadDocument,
  getDocuments,
  getDocument,
  processDocument,
  getContent
}
