import rateLimit from 'express-rate-limit'

function limitHandler(_req: unknown, res: { status: (code: number) => { json: (body: unknown) => void } }) {
  res.status(429).json({
    message: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.',
    code: 'RATE_LIMIT',
  })
}

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
})
