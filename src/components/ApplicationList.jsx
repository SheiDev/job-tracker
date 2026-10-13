import { useState } from 'react'
import Application from './Application.jsx'
import { FilterIcon } from './Icons.jsx'

function ApplicationList({ copy, applications, onUpdate, onDelete }) {
  const [filter, setFilter] = useState('all')

  const visibleApplications = applications.filter((application) => {
    if (filter === 'active') return !application.outcome
    if (filter === 'closed') return application.outcome
    return true
  })

  function downloadCsv() {
    const rows = [
      [
        copy.company,
        copy.role,
        copy.applicationLink,
        copy.currentStage,
        copy.outcome,
        copy.activityType,
        copy.date,
        copy.notes,
        copy.followUp,
      ],
    ]

    applications.forEach((application) => {
      const info = [
        application.company,
        application.role,
        application.link,
        copy.stages[application.stage],
        application.outcome
          ? copy.outcomes[application.outcome]
          : copy.inProgress,
      ]

      if (application.activities.length === 0) rows.push(info)

      application.activities.forEach((activity) => {
        rows.push([
          ...info,
          copy.activityTypes[activity.type],
          activity.date,
          activity.notes,
          activity.followUpDate,
        ])
      })
    })

    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell || '').replaceAll('"', '""')}"`).join(',')
      )
      .join('\n')
    // El \uFEFF hace que Excel lea bien los acentos
    const file = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(file)
    link.download = 'applications.csv'
    link.click()
  }

  return (
    <section className="applications-section">
      <div className="applications-heading">
        <h2>
          {copy.pipeline}{' '}
          <span className="count-pill">{visibleApplications.length}</span>
        </h2>
        <div className="applications-tools">
          <button
            className="button button-secondary export-button"
            type="button"
            onClick={downloadCsv}
            disabled={applications.length === 0}
          >
            {copy.exportCsv}
          </button>
          <label className="filter-control">
            <FilterIcon />
            <span>{copy.show}</span>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">{copy.allApplications}</option>
              <option value="active">{copy.inProgress}</option>
              <option value="closed">{copy.closed}</option>
            </select>
          </label>
        </div>
      </div>

      {visibleApplications.length === 0 ? (
        <div className="empty-state">
          <h3>
            {applications.length === 0
              ? copy.emptyTitle
              : copy.emptyFilterTitle}
          </h3>
          <p>
            {applications.length === 0 ? copy.emptyCopy : copy.emptyFilterCopy}
          </p>
        </div>
      ) : (
        <div className="application-list">
          {visibleApplications.map((application) => (
            <Application
              key={application.id}
              application={application}
              copy={copy}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ApplicationList
