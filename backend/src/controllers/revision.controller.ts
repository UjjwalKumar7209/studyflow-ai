import type { Request, Response } from 'express'

import revisionService from '../services/revision.service'

async function generate(req: Request, res: Response) {
  const revision = await revisionService.generateRevisionNotes(
    req.user!.userId,
    Number(req.params.id)
  )

  return res.json(revision)
}

async function getRevisions(req: Request, res: Response) {
  const revisions = await revisionService.getRevisions(req.user!.userId)

  return res.json(revisions)
}

export default {
  generate,
  getRevisions
}
