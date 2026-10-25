import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Activity } from '../models/Activity.js'
import { Application } from '../models/Application.js'
import { User } from '../models/User.js'
import { httpError } from '../utils/httpError.js'
import { presentUser } from '../utils/present.js'
import { routeParam } from '../utils/routeParam.js'

const BCRYPT_ROUNDS = 10

function requireSelf(req: Request) {
  if (!req.user) throw httpError(401, 'UNAUTHORIZED', 'Necesitas iniciar sesión.')
  return req.user
}

export async function listUsers(_req: Request, res: Response) {
  const users = await User.find().sort({ createdAt: -1 })
  res.json(users.map(presentUser))
}

export async function getUser(req: Request, res: Response) {
  const id = routeParam(req.params.id)
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'No se encontró el usuario.')
  }
  const user = await User.findById(id)
  if (!user) throw httpError(404, 'NOT_FOUND', 'No se encontró el usuario.')
  res.json(presentUser(user))
}

export async function updateUser(req: Request, res: Response) {
  const current = requireSelf(req)
  const id = routeParam(req.params.id)
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'No se encontró el usuario.')
  }
  if (!current._id.equals(id)) {
    throw httpError(403, 'FORBIDDEN', 'Solo puedes editar tu propia cuenta.')
  }

  const user = await User.findById(id).select('+password')
  if (!user) throw httpError(404, 'NOT_FOUND', 'No se encontró el usuario.')

  if (req.body.name !== undefined) user.name = String(req.body.name).trim()
  if (req.body.email !== undefined) user.email = String(req.body.email).trim().toLowerCase()
  if (req.body.password !== undefined) {
    user.password = await bcrypt.hash(String(req.body.password), BCRYPT_ROUNDS)
  }

  await user.save()
  res.json(presentUser(user))
}

export async function deleteUser(req: Request, res: Response) {
  const current = requireSelf(req)
  const id = routeParam(req.params.id)
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'No se encontró el usuario.')
  }
  if (!current._id.equals(id)) {
    throw httpError(403, 'FORBIDDEN', 'Solo puedes eliminar tu propia cuenta.')
  }

  const applications = await Application.find({ user: current._id }).select('_id')
  const applicationIds = applications.map((application) => application._id)
  await Activity.deleteMany({ application: { $in: applicationIds } })
  await Application.deleteMany({ user: current._id })
  await User.findByIdAndDelete(current._id)
  res.status(204).send()
}
