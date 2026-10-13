import { useEffect, useState } from 'react'
import './App.css'
import ApplicationForm from './components/ApplicationForm.jsx'
import ApplicationList from './components/ApplicationList.jsx'
import { GlobeIcon, MoonIcon, SunIcon } from './components/Icons.jsx'
import { translations } from './i18n.js'

function App() {
  const [applications, setApplications] = useState(
    JSON.parse(localStorage.getItem('applications')) || []
  )
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  )
  const copy = translations[language]

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications))
  }, [applications])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem('language', language)
  }, [language])

  function addApplication(newApplication) {
    setApplications([
      {
        ...newApplication,
        id: Date.now(),
        stage: 'To contact',
        outcome: null,
        activities: [],
      },
      ...applications,
    ])
  }

  function updateApplication(id, changes) {
    setApplications(
      applications.map((application) =>
        application.id === id ? { ...application, ...changes } : application
      )
    )
  }

  function deleteApplication(id) {
    setApplications(
      applications.filter((application) => application.id !== id)
    )
  }

  const activeCount = applications.filter(
    (application) => !application.outcome
  ).length
  const interviewCount = applications.filter((application) =>
    application.activities.some((activity) => activity.type === 'Interview')
  ).length

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <h1>Slate</h1>
          <p className="topbar-kicker">{copy.kicker}</p>
        </div>
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
        <div className="utility-toggles">
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

      <ApplicationForm copy={copy} onAdd={addApplication} />

      <ApplicationList
        copy={copy}
        applications={applications}
        onUpdate={updateApplication}
        onDelete={deleteApplication}
      />

      <footer className="app-footer">{copy.footer}</footer>
    </main>
  )
}

export default App
