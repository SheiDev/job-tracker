import { Schema, model, type HydratedDocument, type Types } from 'mongoose'
import { ACTIVITY_TYPES, type ActivityType } from '../constants.js'

export interface IActivity {
  application: Types.ObjectId
  type: ActivityType
  date: string
  notes: string
  followUpDate: string
  createdAt: Date
  updatedAt: Date
}

const activitySchema = new Schema<IActivity>(
  {
    application: { type: Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    type: { type: String, enum: ACTIVITY_TYPES, required: true },
    date: { type: String, required: true },
    notes: { type: String, required: true, trim: true, maxlength: 1000 },
    followUpDate: { type: String, default: '' },
  },
  { timestamps: true },
)

activitySchema.index({ application: 1, createdAt: -1 })

export type ActivityDocument = HydratedDocument<IActivity>
export const Activity = model<IActivity>('Activity', activitySchema)
