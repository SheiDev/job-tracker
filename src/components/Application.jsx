import { useState } from 'react'
import { APPLICATION_STAGES, OUTCOMES } from '../i18n.js'
import ActivityForm from './ActivityForm.jsx'
import { CheckIcon, TrashIcon } from './Icons.jsx'

function Application({ application, copy, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [company, setCompany] = useState(application.company)
  const [role, setRole] = useState(application.role)
  const [link, setLink] = useState(application.link)
  const [showHistory, setShowHistory] = useState(false)
  const [editingActivityId, setEditingActivityId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isClosed = Boolean(application.outcome)
  const stageIndex = APPLICATION_STAGES.indexOf(application.stage)

  let cardClass = `application-card stage-${stageIndex + 1}`
  if (isClosed) {
    cardClass += ` is-closed outcome-${application.outcome.toLowerCase()}`
  }

  function startEditing() {
    setCompany(application.company)
    setRole(application.role)
    setLink(application.link)
    setIsEditing(true)
  }

  function saveEdits(event) {
    event.preventDefault()
    onUpdate(application.id, { company, role, link })
    setIsEditing(false)
  }

  function toggleClosed() {
    onUpdate(application.id, { outcome: isClosed ? null : 'Rejected' })
  }

  function addActivity(activity) {
    onUpdate(application.id, {
      activities: [{ ...activity, id: Date.now() }, ...application.activities],
    })
  }

  function saveActivity(id, changes) {
    onUpdate(application.id, {
      activities: application.activities.map((activity) =>
        activity.id === id ? { ...activity, ...changes } : activity
      ),
    })
    setEditingActivityId(null)
  }

  return (
    <article className={cardClass}>
      {isEditing ? (
        <form className="application-edit-form" onSubmit={saveEdits}>
          <label>
            {copy.company}
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              required
            />
          </label>
          <label>
            {copy.role}
            <input
              value={role}
              onChange={(event) => setRole(event.target.value)}
              required
            />
          </label>
          <label className="edit-link-field">
            {copy.applicationLink}{' '}
            <span className="optional-label">{copy.optional}</span>
            <input
              type="url"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="https://company.com/jobs/..."
            />
          </label>
          <div className="edit-actions">
            <button className="button button-primary" type="submit">
              {copy.saveChanges}
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              {copy.cancelEdit}
            </button>
          </div>
        </form>
      ) : (
        <div className="application-card-heading">
          <div className="application-title">
            <p>{application.company}</p>
            <h3>{application.role}</h3>
            {application.link && (
              <a href={application.link} target="_blank" rel="noreferrer">
                {copy.viewJob}
              </a>
            )}
          </div>
          <span className={isClosed ? 'status-text status-closed' : 'status-text status-active'}>
            {isClosed
              ? copy.outcomes[application.outcome]
              : copy.stages[application.stage]}
          </span>
        </div>
      )}

      <ol className="progress-tracker">
        {APPLICATION_STAGES.map((stage, index) => {
          let stepClass = `progress-step stage-${index + 1}`
          if (isClosed || index < stageIndex) stepClass += ' is-complete'
          if (!isClosed && index === stageIndex) stepClass += ' is-current'

          return (
            <li className={stepClass} key={stage}>
              <span className="progress-marker" />
              <span className="progress-label">{copy.stages[stage]}</span>
            </li>
          )
        })}
      </ol>

      <div className="application-controls">
        <label>
          {copy.currentStage}
          <select
            value={application.stage}
            onChange={(event) =>
              onUpdate(application.id, { stage: event.target.value })
            }
          >
            {APPLICATION_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {copy.stages[stage]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {copy.outcome}
          <select
            value={application.outcome || ''}
            onChange={(event) =>
              onUpdate(application.id, { outcome: event.target.value || null })
            }
          >
            <option value="">{copy.inProgress}</option>
            {OUTCOMES.map((outcome) => (
              <option key={outcome} value={outcome}>
                {copy.outcomes[outcome]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="activity-section">
        <button
          className={showHistory ? 'history-toggle is-open' : 'history-toggle'}
          type="button"
          onClick={() => setShowHistory(!showHistory)}
        >
          <span className="activity-heading">
            <strong>{copy.activityHistory}</strong>
            <span>
              {application.activities.length}{' '}
              {application.activities.length === 1 ? copy.update : copy.updates}
            </span>
          </span>
          <span className="history-arrow" />
        </button>

        {showHistory && (
          <div className="activity-body">
            {application.activities.length === 0 ? (
              <p className="no-activity">{copy.noActivity}</p>
            ) : (
              <ul className="activity-list">
                {application.activities.map((activity) => (
                  <li className="activity-item" key={activity.id}>
                    <span className="activity-dot" />
                    <div className="activity-entry">
                      {editingActivityId === activity.id ? (
                        <ActivityForm
                          copy={copy}
                          activity={activity}
                          onSave={(changes) => saveActivity(activity.id, changes)}
                          onCancel={() => setEditingActivityId(null)}
                        />
                      ) : (
                        <>
                          <p className="activity-meta">
                            {copy.activityTypes[activity.type]} <span>·</span>{' '}
                            {activity.date}
                          </p>
                          <p className="activity-notes">{activity.notes}</p>
                          {activity.followUpDate && (
                            <p className="follow-up">
                              {copy.followUpBy} {activity.followUpDate}
                            </p>
                          )}
                          <button
                            className="edit-button activity-edit-trigger"
                            type="button"
                            onClick={() => setEditingActivityId(activity.id)}
                          >
                            {copy.editUpdate}
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <ActivityForm copy={copy} onSave={addActivity} />
          </div>
        )}
      </div>

      <div className="card-footer">
        {confirmDelete ? (
          <div className="delete-confirm">
            <p>{copy.deleteConfirm}</p>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setConfirmDelete(false)}
            >
              {copy.cancelEdit}
            </button>
            <button
              className="button button-primary delete-confirm-button"
              type="button"
              onClick={() => onDelete(application.id)}
            >
              {copy.confirmDelete}
            </button>
          </div>
        ) : (
          <div className="card-actions">
            {!isEditing && (
              <button className="edit-button" type="button" onClick={startEditing}>
                {copy.editApplication}
              </button>
            )}
            <button
              className={isClosed ? 'icon-action is-active' : 'icon-action'}
              type="button"
              title={isClosed ? copy.reopenApplication : copy.markClosed}
              onClick={toggleClosed}
            >
              <CheckIcon />
            </button>
            <button
              className="icon-action icon-action-danger"
              type="button"
              title={copy.deleteApplication}
              onClick={() => setConfirmDelete(true)}
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default Application
