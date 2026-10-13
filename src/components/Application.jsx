import {
  ACTIVITY_TYPES,
  APPLICATION_STAGES,
  OUTCOMES,
} from '../i18n.js'
import { CheckIcon, TrashIcon } from './Icons.jsx'

function Application({
  application,
  copy,
  editingId,
  editDraft,
  editingActivityId,
  activityDraft,
  historyOpen,
  onEditDraftChange,
  onActivityDraftChange,
  onStartEditing,
  onCancelEditing,
  onSaveEdits,
  onStartEditingActivity,
  onCancelEditingActivity,
  onSaveActivityEdits,
  onUpdate,
  onToggleClosed,
  onDelete,
  onToggleHistory,
  onAddActivity,
}) {
  const currentStageIndex = APPLICATION_STAGES.indexOf(application.stage)
  const isClosed = Boolean(application.outcome)
  const stageNumber = Math.max(currentStageIndex, 0) + 1

  return (
    <article
      className={`application-card stage-${stageNumber}${isClosed ? ' is-closed' : ''}`}
    >
      {editingId === application.id ? (
        <form
          className="application-edit-form"
          onSubmit={(event) => onSaveEdits(event, application.id)}
        >
          <label>
            {copy.company}
            <input
              value={editDraft.company}
              onChange={(event) =>
                onEditDraftChange({ company: event.target.value })
              }
              required
            />
          </label>
          <label>
            {copy.role}
            <input
              value={editDraft.role}
              onChange={(event) =>
                onEditDraftChange({ role: event.target.value })
              }
              required
            />
          </label>
          <label className="edit-link-field">
            {copy.applicationLink}{' '}
            <span className="optional-label">{copy.optional}</span>
            <input
              type="url"
              value={editDraft.link}
              onChange={(event) =>
                onEditDraftChange({ link: event.target.value })
              }
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
              onClick={onCancelEditing}
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
          <span
            className={`status-text ${isClosed ? 'status-closed' : 'status-active'}`}
          >
            {isClosed
              ? copy.outcomes[application.outcome]
              : copy.stages[application.stage]}
          </span>
        </div>
      )}

      <ol
        className="progress-tracker"
        aria-label={`${copy.progressLabel}: ${copy.stages[application.stage] || application.stage}`}
      >
        {APPLICATION_STAGES.map((stage, index) => {
          const isComplete = isClosed || index < currentStageIndex
          const isCurrent = !isClosed && index === currentStageIndex

          return (
            <li
              className={`progress-step stage-${index + 1}${isComplete ? ' is-complete' : ''}${isCurrent ? ' is-current' : ''}`}
              key={stage}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="progress-marker" aria-hidden="true" />
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
          className="history-toggle"
          type="button"
          aria-expanded={historyOpen}
          aria-label={historyOpen ? copy.hideHistory : copy.showHistory}
          onClick={() => onToggleHistory(application.id)}
        >
          <span className="activity-heading">
            <strong>{copy.activityHistory}</strong>
            <span>
              {application.activities.length}{' '}
              {application.activities.length === 1 ? copy.update : copy.updates}
            </span>
          </span>
          <span className="history-arrow" aria-hidden="true" />
        </button>
        {historyOpen && (
          <div className="activity-body">
            {application.activities.length === 0 ? (
              <p className="no-activity">{copy.noActivity}</p>
            ) : (
              <ul className="activity-list">
                {application.activities.map((activity) => (
                  <li className="activity-item" key={activity.id}>
                    <span className="activity-dot" aria-hidden="true" />
                    <div className="activity-entry">
                      {editingActivityId === activity.id ? (
                        <form
                          className="activity-edit-form"
                          onSubmit={(event) =>
                            onSaveActivityEdits(
                              event,
                              application.id,
                              activity.id
                            )
                          }
                        >
                          <label>
                            {copy.activityType}
                            <select
                              name="type"
                              value={activityDraft.type}
                              onChange={(event) =>
                                onActivityDraftChange({
                                  type: event.target.value,
                                })
                              }
                              required
                            >
                              {ACTIVITY_TYPES.map((type) => (
                                <option key={type} value={type}>
                                  {copy.activityTypes[type]}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            {copy.date}
                            <input
                              name="date"
                              type="date"
                              value={activityDraft.date}
                              onChange={(event) =>
                                onActivityDraftChange({
                                  date: event.target.value,
                                })
                              }
                              required
                            />
                          </label>
                          <label className="activity-edit-notes">
                            {copy.notes}
                            <input
                              name="notes"
                              value={activityDraft.notes}
                              onChange={(event) =>
                                onActivityDraftChange({
                                  notes: event.target.value,
                                })
                              }
                              required
                            />
                          </label>
                          <label>
                            {copy.followUp}{' '}
                            <span className="optional-label">
                              {copy.optional}
                            </span>
                            <input
                              name="followUpDate"
                              type="date"
                              value={activityDraft.followUpDate}
                              onChange={(event) =>
                                onActivityDraftChange({
                                  followUpDate: event.target.value,
                                })
                              }
                            />
                          </label>
                          <div className="activity-edit-actions">
                            <button
                              className="button button-primary"
                              type="submit"
                            >
                              {copy.saveChanges}
                            </button>
                            <button
                              className="button button-secondary"
                              type="button"
                              onClick={onCancelEditingActivity}
                            >
                              {copy.cancelEdit}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <p className="activity-meta">
                            {copy.activityTypes[activity.type] || activity.type}{' '}
                            <span>·</span> {activity.date}
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
                            onClick={() => onStartEditingActivity(activity)}
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

            <form
              className="activity-form"
              onSubmit={(event) => onAddActivity(application.id, event)}
            >
              <label>
                {copy.activityType}
                <select name="type" defaultValue="" required>
                  <option value="" disabled>
                    {copy.selectType}
                  </option>
                  {ACTIVITY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {copy.activityTypes[type]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {copy.date}
                <input type="date" name="date" required />
              </label>
              <label className="activity-notes-field">
                {copy.notes}
                <input
                  type="text"
                  name="notes"
                  placeholder={copy.notesPlaceholder}
                  required
                />
              </label>
              <label>
                {copy.followUp}{' '}
                <span className="optional-label">{copy.optional}</span>
                <input type="date" name="followUpDate" />
              </label>
              <button className="button button-secondary" type="submit">
                {copy.addUpdate}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="card-actions">
          {editingId !== application.id && (
            <button
              className="edit-button"
              type="button"
              onClick={() => onStartEditing(application)}
            >
              {copy.editApplication}
            </button>
          )}
          <button
            className="icon-action"
            type="button"
            aria-pressed={isClosed}
            aria-label={isClosed ? copy.reopenApplication : copy.markClosed}
            title={isClosed ? copy.reopenApplication : copy.markClosed}
            onClick={() => onToggleClosed(application)}
          >
            <CheckIcon />
          </button>
          <button
            className="icon-action icon-action-danger"
            type="button"
            aria-label={copy.deleteApplication}
            title={copy.deleteApplication}
            onClick={() => onDelete(application.id)}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </article>
  )
}

export default Application
