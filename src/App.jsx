import { useEffect, useState } from 'react'
import './App.css'
import {
  clearSession,
  createActivity,
  createApplication,
  deleteApplication,
  fetchAccount,
  hasSession,
  listApplications,
  loginAccount,
  registerAccount,
  updateActivity,
  updateApplication,
} from './api.js'
import ApplicationForm from './components/ApplicationForm.jsx'
import ApplicationList from './components/ApplicationList.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import { GlobeIcon, MoonIcon, SunIcon } from './components/Icons.jsx'
import { translations } from './i18n.js'

function readLocalApplications() {
  try {
    const saved = JSON.parse(localStorage.getItem('applications') || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

async function importLocalApplications() {
  const saved = readLocalApplications()
  for (const item of saved) {
    if (!item.company || !item.role) continue
    const application = await createApplication({
      company: item.company,
      role: item.role,
      link: item.link || '',
      stage: item.stage,
      outcome: item.outcome,
    })
    for (const activity of item.activities || []) {
      if (!activity.type || !activity.date || !activity.notes) continue
      await createActivity(application.id, {
        type: activity.type,
        date: String(activity.date).slice(0, 10),
        notes: activity.notes,
        followUpDate: activity.followUpDate
          ? String(activity.followUpDate).slice(0, 10)
          : '',
      })
    }
  }
  localStorage.removeItem('applications')
  return listApplications()
}

function App() {
  const [applications, setApplications] = useState([])
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('checking')
  const [error, setError] = useState('')
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en',
  )
  const copy = translations[language]

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem('language', language)
  }, [language])

  useEffect(() => {
    let active = true

    async function restore() {
      if (!hasSession()) {
        if (active) setStatus('ready')
        return
      }

      try {
        const account = await fetchAccount()
        let saved = await listApplications()
        if (saved.length === 0 && readLocalApplications().length > 0) {
          saved = await importLocalApplications()
        }
        if (!active) return
        setUser(account)
        setApplications(saved)
      } catch (requestError) {
        clearSession()
        if (!active) return
        if (requestError.status !== 401) setError(requestError.message)
      } finally {
        if (active) setStatus('ready')
      }
    }

    restore()
    return () => {
      active = false
    }
  }, [])

  async function run(action) {
    setError('')
    try {
      await action()
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }

  async function enter(account) {
    let saved = await listApplications()
    if (saved.length === 0 && readLocalApplications().length > 0) {
      saved = await importLocalApplications()
    }
    setUser(account)
    setApplications(saved)
  }

  function register(body) {
    return run(async () => {
      const account = await registerAccount(body)
      await enter(account)
    })
  }

  function login(body) {
    return run(async () => {
      const account = await loginAccount(body)
      await enter(account)
    })
  }

  function logout() {
    clearSession()
    setUser(null)
    setApplications([])
    setError('')
  }

  function addApplication(draft) {
    return run(async () => {
      const created = await createApplication(draft)
      setApplications((current) => [created, ...current])
    })
  }

  function editApplication(id, changes) {
    return run(async () => {
      const updated = await updateApplication(id, changes)
      setApplications((current) =>
        current.map((application) =>
          application.id === id ? updated : application,
        ),
      )
    })
  }

  function removeApplication(id) {
    return run(async () => {
      await deleteApplication(id)
      setApplications((current) =>
        current.filter((application) => application.id !== id),
      )
    })
  }

  function addActivity(applicationId, activity) {
    return run(async () => {
      const created = await createActivity(applicationId, activity)
      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? { ...application, activities: [created, ...application.activities] }
            : application,
        ),
      )
    })
  }

  function editActivity(activityId, changes) {
    return run(async () => {
      const updated = await updateActivity(activityId, changes)
      setApplications((current) =>
        current.map((application) => ({
          ...application,
          activities: application.activities.map((activity) =>
            activity.id === activityId ? updated : activity,
          ),
        })),
      )
    })
  }

  const activeCount = applications.filter(
    (application) => !application.outcome,
  ).length
  const interviewCount = applications.filter((application) =>
    application.activities.some((activity) => activity.type === 'Interview'),
  ).length

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <h1>Slate</h1>
          <p className="topbar-kicker">{copy.kicker}</p>
        </div>
        {user && (
          <p className="stat-line">
            <span>
              <strong>{applications.length}</strong> {copy.total.toLowerCase()}
            </span>
            <span>
              <strong className="stat-active">{activeCount}</strong>{' '}
              {copy.active.toLowerCase()}
            </span>
            <span>
              <strong className="stat-interviews">{interviewCount}</strong>{' '}
              {copy.interviews.toLowerCase()}
            </span>
          </p>
        )}
        <div className="utility-toggles">
          {user && (
            <button className="text-toggle" type="button" onClick={logout}>
              {copy.logout}
            </button>
          )}
          <button
            className="text-toggle"
            type="button"
            title={copy.language}
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          >
            <GlobeIcon />
            {language === 'en' ? 'ES' : 'EN'}
          </button>
          <button
            className="text-toggle"
            type="button"
            title={theme === 'dark' ? copy.light : copy.dark}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {error && <p className="form-error">{error}</p>}

      {status === 'checking' ? (
        <p className="auth-hint">{copy.connecting}</p>
      ) : user ? (
        <>
          <p className="account-line">
            {copy.signedInAs} {user.name}
          </p>
          <ApplicationForm copy={copy} onAdd={addApplication} />
          <ApplicationList
            copy={copy}
            applications={applications}
            onUpdate={editApplication}
            onDelete={removeApplication}
            onAddActivity={addActivity}
            onUpdateActivity={editActivity}
          />
        </>
      ) : (
        <AuthScreen copy={copy} onRegister={register} onLogin={login} />
      )}

      <footer className="app-footer">{copy.footer}</footer>
    </main>
  )
}

export default App
