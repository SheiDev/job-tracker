import type { Types } from 'mongoose'
import mongoose from 'mongoose'
import { Application } from '../models/Application.js'

export async function findOwnedApplication(id: string, userId: Types.ObjectId) {
  if (!mongoose.isValidObjectId(id)) return null
  return Application.findOne({ _id: id, user: userId })
}
