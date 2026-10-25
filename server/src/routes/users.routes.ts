import { Router } from 'express'
import { register } from '../controllers/auth.controller.js'
import { deleteUser, getUser, listUsers, updateUser } from '../controllers/users.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimit.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { registerRules, updateUserRules } from '../validators.js'

export const usersRouter = Router()

usersRouter.post('/', authLimiter, validate(registerRules), asyncHandler(register))
usersRouter.use(requireAuth)
usersRouter.get('/', asyncHandler(listUsers))
usersRouter.get('/:id', asyncHandler(getUser))
usersRouter.put('/:id', validate(updateUserRules), asyncHandler(updateUser))
usersRouter.delete('/:id', asyncHandler(deleteUser))
