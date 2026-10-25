export class HttpError extends Error {
  status: number
  code: string
  details?: { field: string; message: string }[]

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function httpError(status: number, code: string, message: string) {
  return new HttpError(status, code, message)
}
