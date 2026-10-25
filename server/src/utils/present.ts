import { Activity, type ActivityDocument } from '../models/Activity.js'
import type { ApplicationDocument } from '../models/Application.js'
import type { UserDocument } from '../models/User.js'

export function presentUser(user: UserDocument) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

export function presentActivity(activity: ActivityDocument) {
  return {
    id: activity.id,
    type: activity.type,
    date: activity.date,
    notes: activity.notes,
    followUpDate: activity.followUpDate || '',
    applicationId: activity.application.toString(),
    createdAt: activity.createdAt,
  }
}

export async function presentApplication(application: ApplicationDocument) {
  const activities = await Activity.find({ application: application._id }).sort({ createdAt: -1 })
  return {
    id: application.id,
    company: application.company,
    role: application.role,
    link: application.link || '',
    stage: application.stage,
    outcome: application.outcome ?? null,
    createdAt: application.createdAt,
    activities: activities.map(presentActivity),
  }
}
