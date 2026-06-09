import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'
import documentRoutes from './routes/document.routes'
import noteRoutes from './routes/note.routes'
import flashcardRoutes from './routes/flashcard.routes'
import quizRoutes from './routes/quiz.routes'
import quizAttemptRoutes from './routes/quiz-attempt.routes'
import analyticsRoutes from './routes/analytics.routes'
import weakTopicRoutes from './routes/weak-topic.routes'
import revisionRoutes from './routes/revision.routes'
import chatRoutes from './routes/chat.routes'

const app = express()
app.use(cookieParser())
app.use(express.json())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/documents', documentRoutes)
app.use('/api/v1', noteRoutes)
app.use('/api/v1', flashcardRoutes)
app.use('/api/v1', quizRoutes)
app.use('/api/v1', quizAttemptRoutes)
app.use('/api/v1', analyticsRoutes)
app.use('/api/v1', weakTopicRoutes)
app.use('/api/v1', revisionRoutes)
app.use('/api/v1', chatRoutes)

app.listen(5000)
