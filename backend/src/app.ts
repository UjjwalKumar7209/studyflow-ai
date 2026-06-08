import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'
import documentRoutes from './routes/document.routes'
import noteRoutes from './routes/note.routes'
import flashcardRoutes from './routes/flashcard.routes'

const app = express()
app.use(cookieParser())
app.use(express.json())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/documents', documentRoutes)
app.use('/api/v1', noteRoutes)
app.use('/api/v1', flashcardRoutes)

app.listen(5000)
