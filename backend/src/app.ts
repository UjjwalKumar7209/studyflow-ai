import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'

const app = express()
app.use(cookieParser())
app.use(express.json())

app.use('/api/v1/auth', authRoutes)

app.listen(5000)
