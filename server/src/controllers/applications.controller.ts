import type { Request, Response } from 'express'
import { Activity } from '../models/Activity.js'
import { Application } from '../models/Application.js'
import { OUTCOMES, type Outcome, type Stage } from '../constants.js'
import { httpError } from '../utils/httpError.js'
import { findOwnedApplication } from '../utils/ownership.js'
import { presentApplication } from '../utils/present.js'
import { routeParam } from '../utils/routeParam.js'

type ApplicationBody = {
  company?: string
  role?: string
  link?: string
  stage?: Stage
  outcome?: Outcome | null
}

function asOutcome(value: string | null | undefined): Outcome | null {
  if (value && OUTCOMES.includes(value as Outcome)) return value as Outcome
  return null
}

function applicationFields(body: ApplicationBody, creating: boolean) {
  const fields: ApplicationBody = {}
  if (body.company !== undefined) fields.company = body.company.trim()
  if (body.role !== undefined) fields.role = body.role.trim()
  if (body.link !== undefined) fields.link = body.link.trim()
  if (body.stage !== undefined) fields.stage = body.stage
  if (creating || body.outcome !== undefined) fields.outcome = asOutcome(body.outcome)
  return fields
}

function currentUserId(req: Request) {
  if (!req.user) throw httpError(401, 'UNAUTHORIZED', 'Necesitas iniciar sesión.')
  return req.user._id
}

export async function listApplications(req: Request, res: Response) {
  const applications = await Application.find({ user: currentUserId(req) }).sort({ createdAt: -1 })
  res.json(await Promise.all(applications.map(presentApplication)))
}

export async function getApplication(req: Request, res: Response) {
  const application = await findOwnedApplication(routeParam(req.params.id), currentUserId(req))
  if (!application) throw httpError(404, 'NOT_FOUND', 'No se encontró la postulación.')
  res.json(await presentApplication(application))
}

export async function createApplication(req: Request, res: Response) {
  const application = await Application.create({
    user: currentUserId(req),
    stage: 'To contact',
    ...applicationFields(req.body as ApplicationBody, true),
  })
  res.status(201).json(await presentApplication(application))
}

export async function updateApplication(req: Request, res: Response) {
  const application = await findOwnedApplication(routeParam(req.params.id), currentUserId(req))
  if (!application) throw httpError(404, 'NOT_FOUND', 'No se encontró la postulación.')

  Object.assign(application, applicationFields(req.body as ApplicationBody, false))
  await application.save()
  res.json(await presentApplication(application))
}

export async function deleteApplication(req: Request, res: Response) {
  const application = await findOwnedApplication(routeParam(req.params.id), currentUserId(req))
  if (!application) throw httpError(404, 'NOT_FOUND', 'No se encontró la postulación.')

  await Activity.deleteMany({ application: application._id })
  await application.deleteOne()
  res.status(204).send()
}
