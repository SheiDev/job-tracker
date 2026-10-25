import type { ErrorRequestHandler } from 'express'
import { HttpError } from '../utils/httpError.js'

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error)
    return
  }

  const parseError = error as {
    type?: string
    name?: string
    code?: number | string
    status?: number
    keyPattern?: Record<string, unknown>
    keyValue?: Record<string, unknown>
    errorResponse?: {
      keyPattern?: Record<string, unknown>
      keyValue?: Record<string, unknown>
    }
  }
  if (parseError.type === 'entity.parse.failed') {
    res.status(400).json({
      message: 'El JSON enviado no es válido.',
      code: 'VALIDATION',
    })
    return
  }

  if (parseError.type === 'entity.too.large' || parseError.status === 413) {
    res.status(413).json({
      message: 'El cuerpo de la solicitud es demasiado grande.',
      code: 'VALIDATION',
    })
    return
  }

  if (parseError.name === 'ValidationError' && error && typeof error === 'object' && 'errors' in error) {
    const details = Object.values(
      (error as { errors: Record<string, { path?: string; message: string }> }).errors,
    ).map((item) => ({
      field: item.path ?? '',
      message: item.message,
    }))
    res.status(400).json({
      message: 'Hay datos inválidos.',
      code: 'VALIDATION',
      errors: details,
    })
    return
  }

  if (parseError.name === 'CastError') {
    res.status(404).json({
      message: 'No se encontró el registro.',
      code: 'NOT_FOUND',
    })
    return
  }

  if (parseError.code === 11000) {
    const fields = {
      ...parseError.keyPattern,
      ...parseError.keyValue,
      ...parseError.errorResponse?.keyPattern,
      ...parseError.errorResponse?.keyValue,
    }
    if ('email' in fields) {
      res.status(409).json({
        message: 'Ese email ya está registrado.',
        code: 'EMAIL_TAKEN',
      })
      return
    }

    res.status(409).json({
      message: 'Ese dato ya está registrado.',
      code: 'CONFLICT',
    })
    return
  }

  if (error instanceof HttpError) {
    const body: { message: string; code: string; errors?: HttpError['details'] } = {
      message: error.message,
      code: error.code,
    }
    if (error.details) body.errors = error.details
    res.status(error.status).json(body)
    return
  }

  console.error(error)
  res.status(500).json({
    message: 'Error interno del servidor.',
    code: 'INTERNAL',
  })
}
