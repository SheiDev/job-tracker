import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!token) {
    res.status(401).json({
      message: 'Necesitas iniciar sesión.',
      code: 'UNAUTHORIZED',
    })
    return
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      res.status(500).json({ message: 'Error interno del servidor.', code: 'INTERNAL' })
      return
    }

    const payload = jwt.verify(token, secret)
    const id = typeof payload === 'string' ? '' : payload.id
    const user = typeof id === 'string' && id ? await User.findById(id) : null
    if (!user) {
      res.status(401).json({
        message: 'La sesión no es válida.',
        code: 'UNAUTHORIZED',
      })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({
      message: 'La sesión no es válida.',
      code: 'UNAUTHORIZED',
    })
  }
})
