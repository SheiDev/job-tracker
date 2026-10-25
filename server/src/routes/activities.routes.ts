import { Router } from 'express'
import {
  deleteActivity,
  getActivity,
  listActivities,
  updateActivity,
} from '../controllers/activities.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { activityRules } from '../validators.js'

export const activitiesRouter = Router()

activitiesRouter.use(requireAuth)
activitiesRouter.get('/', asyncHandler(listActivities))
activitiesRouter.get('/:id', asyncHandler(getActivity))
activitiesRouter.put('/:id', validate(activityRules), asyncHandler(updateActivity))
activitiesRouter.delete('/:id', asyncHandler(deleteActivity))
