import { useState } from 'react'
import { ACTIVITY_TYPES } from '../i18n.js'

function ActivityForm({ copy, activity, onSave, onCancel }) {
  const isEditing = Boolean(activity)
  const [type, setType] = useState(activity ? activity.type : '')
  const [date, setDate] = useState(activity ? activity.date : '')
  const [notes, setNotes] = useState(activity ? activity.notes : '')
  const [followUpDate, setFollowUpDate] = useState(
    activity ? activity.followUpDate : ''
  )

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await onSave({ type, date, notes, followUpDate })
    } catch {
      return
    }

    if (!isEditing) {
      setType('')
      setDate('')
      setNotes('')
      setFollowUpDate('')
    }
  }

  return (
    <form
      className={isEditing ? 'activity-edit-form' : 'activity-form'}
      onSubmit={handleSubmit}
    >
      <label>
        {copy.activityType}
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          required
        >
          <option value="" disabled>
            {copy.selectType}
          </option>
          {ACTIVITY_TYPES.map((activityType) => (
            <option key={activityType} value={activityType}>
              {copy.activityTypes[activityType]}
            </option>
          ))}
        </select>
      </label>
      <label>
        {copy.date}
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </label>
      <label className={isEditing ? 'activity-edit-notes' : 'activity-notes-field'}>
        {copy.notes}
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={copy.notesPlaceholder}
          required
        />
      </label>
      <label>
        {copy.followUp} <span className="optional-label">{copy.optional}</span>
        <input
          type="date"
          value={followUpDate}
          onChange={(event) => setFollowUpDate(event.target.value)}
        />
      </label>

      {isEditing ? (
        <div className="activity-edit-actions">
          <button className="button button-primary" type="submit">
            {copy.saveChanges}
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={onCancel}
          >
            {copy.cancelEdit}
          </button>
        </div>
      ) : (
        <button className="button button-secondary" type="submit">
          {copy.addUpdate}
        </button>
      )}
    </form>
  )
}

export default ActivityForm
