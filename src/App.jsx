import { useEffect, useState } from 'react'
import './App.css'
import ApplicationForm from './components/ApplicationForm.jsx'
import ApplicationList from './components/ApplicationList.jsx'
import { escapeCsvCell, parseCsv, restoreCsvValue } from './csv.js'
import {
  ACTIVITY_TYPES,
  APPLICATION_STAGES,
  OUTCOMES,
  translations,
} from './i18n.js'

function getSavedApplications() {
  try {
    const savedApplications = localStorage.getItem('applications')
    const parsedApplications = savedApplications
      ? JSON.parse(savedApplications)
      : []

    return parsedApplications.map((application) => ({
      ...application,
      activities: application.activities || [],
      outcome: application.outcome || null,
    }))
  } catch {
    return []
  }
}

function getSavedTheme() {
  try {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
  } catch {
    /* ignore unavailable storage */
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getSavedLanguage() {
  try {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage === 'es' || savedLanguage === 'en') return savedLanguage
  } catch {
    /* ignore unavailable storage */
  }

  return navigator.language.startsWith('es') ? 'es' : 'en'
}

function App() {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [link, setLink] = useState('')
  const [applications, setApplications] = useState(getSavedApplications)
  const [importStatus, setImportStatus] = useState('')
  const [filter, setFilter] = useState('all')
  const [theme, setTheme] = useState(getSavedTheme)
  const [language, setLanguage] = useState(getSavedLanguage)
  const [openHistory, setOpenHistory] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({ company: '', role: '', link: '' })
  const [editingActivityId, setEditingActivityId] = useState(null)
  const [activityDraft, setActivityDraft] = useState({
    type: '',
    date: '',
    notes: '',
    followUpDate: '',
  })
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

  function handleSubmit(event) {
    event.preventDefault()

    const newApplication = {
      id: crypto.randomUUID(),
      company,
      role,
      link,
      stage: 'To contact',
      outcome: null,
      activities: [],
    }

    setApplications((currentApplications) => [
      newApplication,
      ...currentApplications,
    ])
    setCompany('')
    setRole('')
    setLink('')
  }

  function deleteApplication(id) {
    setApplications((currentApplications) =>
      currentApplications.filter((application) => application.id !== id)
    )
  }

  function updateApplication(id, changes) {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === id ? { ...application, ...changes } : application
      )
    )
  }

  function toggleClosed(application) {
    updateApplication(application.id, {
      outcome: application.outcome ? null : 'Rejected',
    })
  }

  function startEditing(application) {
    setEditingId(application.id)
    setEditDraft({
      company: application.company,
      role: application.role,
      link: application.link || '',
    })
  }

  function saveApplicationEdits(event, applicationId) {
    event.preventDefault()
    updateApplication(applicationId, editDraft)
    setEditingId(null)
  }

  function startEditingActivity(activity) {
    setEditingActivityId(activity.id)
    setActivityDraft({
      type: activity.type,
      date: activity.date,
      notes: activity.notes,
      followUpDate: activity.followUpDate || '',
    })
  }

  function saveActivityEdits(event, applicationId, activityId) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const changes = {
      type: formData.get('type'),
      date: formData.get('date'),
      notes: formData.get('notes'),
      followUpDate: formData.get('followUpDate'),
    }
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              activities: application.activities.map((activity) =>
                activity.id === activityId
                  ? { ...activity, ...changes }
                  : activity
              ),
            }
          : application
      )
    )
    setEditingActivityId(null)
  }

  function addActivity(applicationId, event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const newActivity = {
      id: crypto.randomUUID(),
      type: formData.get('type'),
      date: formData.get('date'),
      notes: formData.get('notes'),
      followUpDate: formData.get('followUpDate'),
    }

    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              activities: [newActivity, ...application.activities],
            }
          : application
      )
    )
    form.reset()
    setOpenHistory((current) => ({ ...current, [applicationId]: true }))
  }

  function toggleHistory(applicationId) {
    setOpenHistory((current) => ({
      ...current,
      [applicationId]: !current[applicationId],
    }))
  }

  function exportApplications() {
    const headers = [
      copy.company,
      copy.role,
      copy.applicationLink,
      copy.currentStage,
      copy.outcome,
      copy.activityType,
      copy.date,
      copy.notes,
      copy.followUp,
    ]
    const rows = applications.flatMap((application) => {
      const activities = application.activities.length
        ? application.activities
        : [null]

      return activities.map((activity) => [
        application.company,
        application.role,
        application.link,
        copy.stages[application.stage] || application.stage,
        application.outcome
          ? copy.outcomes[application.outcome] || application.outcome
          : copy.inProgress,
        activity ? copy.activityTypes[activity.type] || activity.type : '',
        activity?.date || '',
        activity?.notes || '',
        activity?.followUpDate || '',
      ])
    })
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvCell).join(','))
      .join('\r\n')
    const file = new Blob([`\uFEFF${csv}`], {
      type: 'text/csv;charset=utf-8',
    })
    const url = URL.createObjectURL(file)
    const linkElement = document.createElement('a')
    linkElement.href = url
    linkElement.download = `postulaciones-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(linkElement)
    linkElement.click()
    linkElement.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function importApplications(event) {
    const fileInput = event.currentTarget
    const file = fileInput.files?.[0]
    if (!file) return

    try {
      const rows = parseCsv(await file.text())
      const header = rows.shift()?.map((value) => value.trim()) || []
      const headerLabels = ['en', 'es'].map((locale) => translations[locale])
      const indexFor = (key) =>
        header.findIndex((value) =>
          headerLabels.some((labels) => value === labels[key])
        )
      const indexes = {
        company: indexFor('company'),
        role: indexFor('role'),
        link: indexFor('applicationLink'),
        stage: indexFor('currentStage'),
        outcome: indexFor('outcome'),
        type: indexFor('activityType'),
        date: indexFor('date'),
        notes: indexFor('notes'),
        followUp: indexFor('followUp'),
      }

      if (indexes.company < 0 || indexes.role < 0 || indexes.stage < 0) {
        throw new Error('Unsupported CSV header')
      }

      const readValue = (values, index) =>
        index < 0 ? '' : restoreCsvValue(values[index] || '').trim()
      const canonicalValue = (value, key, allowedValues) => {
        if (!value) return ''
        return (
          allowedValues.find((item) =>
            headerLabels.some((labels) => labels[key][item] === value)
          ) || value
        )
      }
      const imported = new Map()

      rows.forEach((values) => {
        const companyName = readValue(values, indexes.company)
        const roleName = readValue(values, indexes.role)
        if (!companyName || !roleName) return

        const linkValue = readValue(values, indexes.link)
        const key = JSON.stringify([companyName, roleName, linkValue])
        const stageValue = canonicalValue(
          readValue(values, indexes.stage),
          'stages',
          APPLICATION_STAGES
        )
        const rawOutcome = readValue(values, indexes.outcome)
        const isInProgress = headerLabels.some(
          (labels) => rawOutcome === labels.inProgress
        )
        const outcomeValue = canonicalValue(
          isInProgress ? '' : rawOutcome,
          'outcomes',
          OUTCOMES
        )
        const existing = imported.get(key) || {
          company: companyName,
          role: roleName,
          link: linkValue,
          stage: stageValue || APPLICATION_STAGES[0],
          outcome: outcomeValue || null,
          activities: [],
        }

        const activityType = canonicalValue(
          readValue(values, indexes.type),
          'activityTypes',
          ACTIVITY_TYPES
        )
        const activityDate = readValue(values, indexes.date)
        const activityNotes = readValue(values, indexes.notes)
        const followUpDate = readValue(values, indexes.followUp)
        if (activityType && activityDate) {
          const activity = {
            type: activityType,
            date: activityDate,
            notes: activityNotes,
            followUpDate,
          }
          const isDuplicate = existing.activities.some(
            (current) =>
              current.type === activity.type &&
              current.date === activity.date &&
              current.notes === activity.notes &&
              (current.followUpDate || '') === activity.followUpDate
          )
          if (!isDuplicate) existing.activities.push(activity)
        }
        imported.set(key, existing)
      })

      if (!imported.size) throw new Error('No application rows found')

      const records = [...imported.values()]
      setApplications((currentApplications) => {
        const nextApplications = [...currentApplications]
        records.forEach((record) => {
          const existingIndex = nextApplications.findIndex(
            (application) =>
              JSON.stringify([
                application.company.trim(),
                application.role.trim(),
                (application.link || '').trim(),
              ]) === JSON.stringify([record.company, record.role, record.link])
          )

          if (existingIndex < 0) {
            nextApplications.unshift({
              ...record,
              id: crypto.randomUUID(),
              activities: record.activities.map((activity) => ({
                ...activity,
                id: crypto.randomUUID(),
              })),
            })
            return
          }

          const current = nextApplications[existingIndex]
          const newActivities = record.activities.filter(
            (activity) =>
              !current.activities.some(
                (item) =>
                  item.type === activity.type &&
                  item.date === activity.date &&
                  item.notes === activity.notes &&
                  (item.followUpDate || '') === activity.followUpDate
              )
          )
          nextApplications[existingIndex] = {
            ...current,
            stage: record.stage,
            outcome: record.outcome,
            activities: [
              ...newActivities.map((activity) => ({
                ...activity,
                id: crypto.randomUUID(),
              })),
              ...current.activities,
            ],
          }
        })
        return nextApplications
      })
      setImportStatus(`${records.length} ${copy.importSuccess}`)
    } catch {
      setImportStatus(copy.importError)
    } finally {
      fileInput.value = ''
    }
  }

  const visibleApplications = applications.filter((application) => {
    if (filter === 'active') return !application.outcome
    if (filter === 'closed') return Boolean(application.outcome)
    return true
  })
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
        <p className="stat-line" aria-label={copy.overview}>
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
            aria-label={
              language === 'en' ? copy.switchToSpanish : copy.switchToEnglish
            }
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          >
            {language === 'en' ? 'ES' : 'EN'}
          </button>
          <button
            className="text-toggle"
            type="button"
            aria-pressed={theme === 'dark'}
            aria-label={
              theme === 'dark' ? copy.switchToLight : copy.switchToDark
            }
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? copy.light : copy.dark}
          </button>
        </div>
      </header>

      <ApplicationForm
        copy={copy}
        company={company}
        role={role}
        link={link}
        onCompanyChange={(event) => setCompany(event.target.value)}
        onRoleChange={(event) => setRole(event.target.value)}
        onLinkChange={(event) => setLink(event.target.value)}
        onSubmit={handleSubmit}
      />

      <ApplicationList
        copy={copy}
        applications={applications}
        visibleApplications={visibleApplications}
        filter={filter}
        importStatus={importStatus}
        editingId={editingId}
        editDraft={editDraft}
        editingActivityId={editingActivityId}
        activityDraft={activityDraft}
        openHistory={openHistory}
        onFilterChange={(event) => setFilter(event.target.value)}
        onImport={importApplications}
        onExport={exportApplications}
        onEditDraftChange={(changes) =>
          setEditDraft((current) => ({ ...current, ...changes }))
        }
        onActivityDraftChange={(changes) =>
          setActivityDraft((current) => ({ ...current, ...changes }))
        }
        onStartEditing={startEditing}
        onCancelEditing={() => setEditingId(null)}
        onSaveEdits={saveApplicationEdits}
        onStartEditingActivity={startEditingActivity}
        onCancelEditingActivity={() => setEditingActivityId(null)}
        onSaveActivityEdits={saveActivityEdits}
        onUpdate={updateApplication}
        onToggleClosed={toggleClosed}
        onDelete={deleteApplication}
        onToggleHistory={toggleHistory}
        onAddActivity={addActivity}
      />
      <footer className="app-footer">{copy.footer}</footer>
    </main>
  )
}

export default App
