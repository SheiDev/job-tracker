import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimit.js'
import { activitiesRouter } from './routes/activities.routes.js'
import { applicationsRouter } from './routes/applications.routes.js'
import { authRouter } from './routes/auth.routes.js'
import { usersRouter } from './routes/users.routes.js'

const app = express()
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: origins }))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'slate-api' })
})

app.use('/api', apiLimiter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/activities', activitiesRouter)

app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.', code: 'NOT_FOUND' })
})
app.use(errorHandler)

export default app
