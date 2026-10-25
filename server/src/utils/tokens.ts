import jwt from 'jsonwebtoken'
import type { UserDocument } from '../models/User.js'

export function signToken(user: UserDocument) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Falta JWT_SECRET')
  return jwt.sign({ id: user.id }, secret, { expiresIn: '7d' })
}
