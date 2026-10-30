import { body, type ValidationChain } from 'express-validator'
import { ACTIVITY_TYPES, OUTCOMES, STAGES, isDateOnly, isHttpUrl } from './constants.js'

function optionalUrl(value: unknown) {
  return value === '' || isHttpUrl(value)
}

function optionalOutcome(value: unknown) {
  return value === '' || value === null || (typeof value === 'string' && OUTCOMES.includes(value as (typeof OUTCOMES)[number]))
}

function strongPassword(value: unknown) {
  return (
    typeof value === 'string' &&
    value.length >= 8 &&
    value.length <= 72 &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  )
}

const passwordMessage =
  'La contraseña necesita al menos 8 caracteres, una mayúscula, un número y un signo.'

export const registerRules: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('El nombre tiene que tener entre 2 y 80 caracteres.'),
  body('email').trim().toLowerCase().isEmail().withMessage('Ingresa un email válido.'),
  body('password').custom(strongPassword).withMessage(passwordMessage),
]

export const loginRules: ValidationChain[] = [
  body('email').trim().toLowerCase().isEmail().withMessage('Ingresa un email válido.'),
  body('password').notEmpty().withMessage('Ingresa la contraseña.'),
]

export const updateUserRules: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('El nombre tiene que tener entre 2 y 80 caracteres.'),
  body('email').optional().trim().toLowerCase().isEmail().withMessage('Ingresa un email válido.'),
  body('password').optional().custom(strongPassword).withMessage(passwordMessage),
  body().custom((_value, { req }) => {
    const body = req.body as { name?: unknown; email?: unknown; password?: unknown }
    if (body.name === undefined && body.email === undefined && body.password === undefined) {
      throw new Error('Envía al menos un campo para actualizar.')
    }
    return true
  }),
]

export const createApplicationRules: ValidationChain[] = [
  body('company').trim().notEmpty().isLength({ max: 120 }).withMessage('La empresa es obligatoria.'),
  body('role').trim().notEmpty().isLength({ max: 120 }).withMessage('El puesto es obligatorio.'),
  body('link')
    .optional({ values: 'null' })
    .trim()
    .custom(optionalUrl)
    .withMessage('El enlace tiene que incluir http o https.'),
  body('stage').optional().isIn(STAGES).withMessage('La etapa no es válida.'),
  body('outcome')
    .optional({ values: 'null' })
    .custom(optionalOutcome)
    .withMessage('El resultado no es válido.'),
]

export const updateApplicationRules: ValidationChain[] = [
  body('company')
    .optional()
    .trim()
    .notEmpty()
    .isLength({ max: 120 })
    .withMessage('La empresa es obligatoria.'),
  body('role')
    .optional()
    .trim()
    .notEmpty()
    .isLength({ max: 120 })
    .withMessage('El puesto es obligatorio.'),
  body('link')
    .optional({ values: 'null' })
    .trim()
    .custom(optionalUrl)
    .withMessage('El enlace tiene que incluir http o https.'),
  body('stage').optional().isIn(STAGES).withMessage('La etapa no es válida.'),
  body('outcome')
    .optional({ values: 'null' })
    .custom(optionalOutcome)
    .withMessage('El resultado no es válido.'),
  body().custom((_value, { req }) => {
    const fields = ['company', 'role', 'link', 'stage', 'outcome'] as const
    const body = req.body as Record<string, unknown>
    if (!fields.some((field) => body[field] !== undefined)) {
      throw new Error('Envía al menos un campo para actualizar.')
    }
    return true
  }),
]

export const activityRules: ValidationChain[] = [
  body('type').isIn(ACTIVITY_TYPES).withMessage('Elige un tipo de actividad válido.'),
  body('date').custom(isDateOnly).withMessage('La fecha no es válida.'),
  body('notes').trim().notEmpty().isLength({ max: 1000 }).withMessage('Las notas son obligatorias.'),
  body('followUpDate')
    .optional({ values: 'falsy' })
    .custom(isDateOnly)
    .withMessage('La fecha de seguimiento no es válida.'),
]
