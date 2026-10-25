import { Schema, model, type HydratedDocument, type Types } from 'mongoose'
import { OUTCOMES, STAGES, type Outcome, type Stage } from '../constants.js'

export interface IApplication {
  user: Types.ObjectId
  company: string
  role: string
  link: string
  stage: Stage
  outcome: Outcome | null
  createdAt: Date
  updatedAt: Date
}

const applicationSchema = new Schema<IApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    link: { type: String, trim: true, default: '' },
    stage: { type: String, enum: STAGES, default: 'To contact' },
    outcome: { type: String, enum: [...OUTCOMES, null], default: null },
  },
  { timestamps: true },
)

applicationSchema.index({ user: 1, createdAt: -1 })

export type ApplicationDocument = HydratedDocument<IApplication>
export const Application = model<IApplication>('Application', applicationSchema)
