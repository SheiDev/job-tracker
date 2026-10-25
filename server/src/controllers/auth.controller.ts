import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express'
import { User } from '../models/User.js'
import { httpError } from '../utils/httpError.js'
import { presentUser } from '../utils/present.js'
import { signToken } from '../utils/tokens.js'

const BCRYPT_ROUNDS = 10

function sessionFor(user: Parameters<typeof presentUser>[0]) {
  return {
    token: signToken(user),
    user: presentUser(user),
  }
}

export async function register(req: Request, res: Response) {
  const name = String(req.body.name).trim()
  const email = String(req.body.email).trim().toLowerCase()
  const existing = await User.findOne({ email })
  if (existing) throw httpError(409, 'EMAIL_TAKEN', 'Ese email ya está registrado.')

  const password = await bcrypt.hash(String(req.body.password), BCRYPT_ROUNDS)
  const user = await User.create({ name, email, password })
  res.status(201).json(sessionFor(user))
}

export async function login(req: Request, res: Response) {
  const email = String(req.body.email).trim().toLowerCase()
  const user = await User.findOne({ email }).select('+password')
  const matches = user ? await bcrypt.compare(String(req.body.password), user.password) : false
  if (!user || !matches) {
    throw httpError(401, 'INVALID_CREDENTIALS', 'Email o contraseña incorrectos.')
  }

  res.json(sessionFor(user))
}

export function me(req: Request, res: Response) {
  if (!req.user) throw httpError(401, 'UNAUTHORIZED', 'Necesitas iniciar sesión.')
  res.json(presentUser(req.user))
}
