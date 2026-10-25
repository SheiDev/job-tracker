import { Schema, model, type HydratedDocument, type Types } from 'mongoose'

export interface IUser {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
)

export type UserDocument = HydratedDocument<IUser>
export const User = model<IUser>('User', userSchema)

export type UserId = Types.ObjectId
