import type { Request, Response } from 'express'

import documentService from '../services/document.service'

async function upload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        msg: 'File is required'
      })
    }

    const document = await documentService.uploadDocument(
      req.user!.userId,
      req.file
    )

    return res.status(201).json({
      msg: 'Document uploaded',
      document
    })
  } catch {
    return res.status(500).json({
      msg: 'Upload failed'
    })
  }
}

async function getDocuments(req: Request, res: Response) {
  try {
    const documents = await documentService.getDocuments(req.user!.userId)

    return res.json(documents)
  } catch {
    return res.status(500).json({
      msg: 'Failed'
    })
  }
}

async function getDocument(req: Request, res: Response) {
  try {
    const document = await documentService.getDocument(
      Number(req.params.id),
      req.user!.userId
    )

    return res.json(document)
  } catch (error) {
    return res.status(404).json({
      msg: error instanceof Error ? error.message : 'Failed'
    })
  }
}

export default {
  upload,
  getDocuments,
  getDocument
}
