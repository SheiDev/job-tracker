import type { Request, Response } from 'express'
import mongoose, { type Types } from 'mongoose'
import { Activity } from '../models/Activity.js'
import { Application } from '../models/Application.js'
import type { ActivityType } from '../constants.js'
import { httpError } from '../utils/httpError.js'
import { findOwnedApplication } from '../utils/ownership.js'
import { presentActivity } from '../utils/present.js'
import { routeParam } from '../utils/routeParam.js'

type ActivityBody = {
  type: ActivityType
  date: string
  notes: string
  followUpDate?: string
}

function activityFields(body: ActivityBody) {
  return {
    type: body.type,
    date: body.date,
    notes: body.notes.trim(),
    followUpDate: body.followUpDate || '',
  }
}

function currentUserId(req: Request) {
  if (!req.user) throw httpError(401, 'UNAUTHORIZED', 'Necesitas iniciar sesión.')
  return req.user._id
}

async function findOwnedActivity(id: string, userId: Types.ObjectId) {
  if (!mongoose.isValidObjectId(id)) return null
  const activity = await Activity.findById(id)
  if (!activity) return null
  const application = await findOwnedApplication(String(activity.application), userId)
  if (!application) return null
  return activity
}

export async function listActivities(req: Request, res: Response) {
  const applications = await Application.find({ user: currentUserId(req) }).select('_id')
  const activities = await Activity.find({
    application: { $in: applications.map((application) => application._id) },
  }).sort({ createdAt: -1 })
  res.json(activities.map(presentActivity))
}

export async function listApplicationActivities(req: Request, res: Response) {
  const application = await findOwnedApplication(routeParam(req.params.id), currentUserId(req))
  if (!application) throw httpError(404, 'NOT_FOUND', 'No se encontró la postulación.')

  const activities = await Activity.find({ application: application._id }).sort({ createdAt: -1 })
  res.json(activities.map(presentActivity))
}

export async function getActivity(req: Request, res: Response) {
  const activity = await findOwnedActivity(routeParam(req.params.id), currentUserId(req))
  if (!activity) throw httpError(404, 'NOT_FOUND', 'No se encontró la actividad.')
  res.json(presentActivity(activity))
}

export async function createActivity(req: Request, res: Response) {
  const application = await findOwnedApplication(routeParam(req.params.id), currentUserId(req))
  if (!application) throw httpError(404, 'NOT_FOUND', 'No se encontró la postulación.')

  const activity = await Activity.create({
    application: application._id,
    ...activityFields(req.body as ActivityBody),
  })
  res.status(201).json(presentActivity(activity))
}

export async function updateActivity(req: Request, res: Response) {
  const activity = await findOwnedActivity(routeParam(req.params.id), currentUserId(req))
  if (!activity) throw httpError(404, 'NOT_FOUND', 'No se encontró la actividad.')

  Object.assign(activity, activityFields(req.body as ActivityBody))
  await activity.save()
  res.json(presentActivity(activity))
}

export async function deleteActivity(req: Request, res: Response) {
  const activity = await findOwnedActivity(routeParam(req.params.id), currentUserId(req))
  if (!activity) throw httpError(404, 'NOT_FOUND', 'No se encontró la actividad.')

  await activity.deleteOne()
  res.status(204).send()
}
