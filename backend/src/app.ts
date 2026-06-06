import express, { type Request, type Response } from 'express'

const app = express()

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok'
  })
})

app.listen(5000)