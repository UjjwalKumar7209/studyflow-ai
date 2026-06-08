import type { Request, Response } from 'express'

import noteService from '../services/note.service'

async function generateNotes(req: Request, res: Response) {
  try {
    const note = await noteService.generateTopicNotes(Number(req.params.id))

    return res.json(note)
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      msg: error instanceof Error ? error.message : 'Failed'
    })
  }
}

async function getNotes(req: Request, res: Response) {
  const note = await noteService.getNotes(Number(req.params.id))

  return res.json(note)
}

export default {
  generateNotes,
  getNotes
}
