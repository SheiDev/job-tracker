const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:4000'
    : 'https://job-tracker-zn79.onrender.com')

const TOKEN_KEY = 'slate-token'

export function hasSession() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
}

function saveSession(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new Error(
      'No se pudo conectar con la API. Si acaba de despertar, espera unos segundos e inténtalo otra vez.',
    )
  }

  if (response.status === 204) return null

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    const detail = data?.errors?.[0]?.message
    const error = new Error(detail || data?.message || 'No se pudo completar la solicitud.')
    error.status = response.status
    throw error
  }

  return data
}

async function openSession(path, body) {
  const data = await request(path, { method: 'POST', body, auth: false })
  saveSession(data.token)
  return data.user
}

export function registerAccount(body) {
  return openSession('/api/auth/register', body)
}

export function loginAccount(body) {
  return openSession('/api/auth/login', body)
}

export function fetchAccount() {
  return request('/api/auth/me')
}

export function listApplications() {
  return request('/api/applications')
}

export function createApplication(body) {
  return request('/api/applications', { method: 'POST', body })
}

export function updateApplication(id, body) {
  return request(`/api/applications/${id}`, { method: 'PUT', body })
}

export function deleteApplication(id) {
  return request(`/api/applications/${id}`, { method: 'DELETE' })
}

export function createActivity(applicationId, body) {
  return request(`/api/applications/${applicationId}/activities`, {
    method: 'POST',
    body,
  })
}

export function updateActivity(id, body) {
  return request(`/api/activities/${id}`, { method: 'PUT', body })
}
