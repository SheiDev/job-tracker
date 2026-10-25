import { Router } from 'express'
import { createActivity, listApplicationActivities } from '../controllers/activities.controller.js'
import {
  createApplication,
  deleteApplication,
  getApplication,
  listApplications,
  updateApplication,
} from '../controllers/applications.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { activityRules, createApplicationRules, updateApplicationRules } from '../validators.js'

export const applicationsRouter = Router()

applicationsRouter.use(requireAuth)
applicationsRouter.get('/', asyncHandler(listApplications))
applicationsRouter.post('/', validate(createApplicationRules), asyncHandler(createApplication))
applicationsRouter.get('/:id/activities', asyncHandler(listApplicationActivities))
applicationsRouter.post('/:id/activities', validate(activityRules), asyncHandler(createActivity))
applicationsRouter.get('/:id', asyncHandler(getApplication))
applicationsRouter.put('/:id', validate(updateApplicationRules), asyncHandler(updateApplication))
applicationsRouter.delete('/:id', asyncHandler(deleteApplication))
