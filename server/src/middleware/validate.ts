import type { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import { httpError } from '../utils/httpError.js'

export function validate(rules: RequestHandler[]): RequestHandler[] {
  return [
    ...rules,
    (req, _res, next) => {
      const result = validationResult(req)
      if (result.isEmpty()) {
        next()
        return
      }

      const error = httpError(400, 'VALIDATION', 'Hay datos inválidos.')
      error.details = result.array().map((item) => ({
        field: 'path' in item ? item.path : '',
        message: item.msg,
      }))
      next(error)
    },
  ]
}
