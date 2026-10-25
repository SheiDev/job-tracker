import { Router } from 'express'
import { login, me, register } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimit.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { loginRules, registerRules } from '../validators.js'

export const authRouter = Router()

authRouter.post('/register', authLimiter, validate(registerRules), asyncHandler(register))
authRouter.post('/login', authLimiter, validate(loginRules), asyncHandler(login))
authRouter.get('/me', requireAuth, asyncHandler(me))
