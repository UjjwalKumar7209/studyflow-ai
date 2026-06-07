import documentRepository from '../repositories/document.repository'

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

export default {
  uploadDocument,
  getDocuments,
  getDocument
}
