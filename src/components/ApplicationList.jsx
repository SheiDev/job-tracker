import { FilterIcon } from './Icons.jsx'
import Application from './Application.jsx'

function ApplicationList({
  copy,
  applications,
  visibleApplications,
  filter,
  importStatus,
  editingId,
  editDraft,
  editingActivityId,
  activityDraft,
  openHistory,
  onFilterChange,
  onImport,
  onExport,
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
  return (
    <section className="applications-section">
      <div className="applications-heading">
        <div>
          <h2>
            {copy.pipeline}{' '}
            <span className="count-pill">{visibleApplications.length}</span>
          </h2>
        </div>
        <div className="applications-tools">
          <label className="button button-secondary export-button import-button">
            {copy.importCsv}
            <input
              className="import-file-input"
              type="file"
              accept=".csv,text/csv"
              onChange={onImport}
              aria-label={copy.importCsv}
            />
          </label>
          <button
            className="button button-secondary export-button"
            type="button"
            onClick={onExport}
            disabled={applications.length === 0}
          >
            {copy.exportCsv}
          </button>
          <label className="filter-control">
            <FilterIcon />
            <span>{copy.show}</span>
            <select
              value={filter}
              onChange={onFilterChange}
              aria-label={copy.filterApplications}
            >
              <option value="all">{copy.allApplications}</option>
              <option value="active">{copy.inProgress}</option>
              <option value="closed">{copy.closed}</option>
            </select>
          </label>
        </div>
      </div>
      {importStatus && (
        <p className="import-status" role="status">
          {importStatus}
        </p>
      )}

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
              editingId={editingId}
              editDraft={editDraft}
              editingActivityId={editingActivityId}
              activityDraft={activityDraft}
              historyOpen={Boolean(openHistory[application.id])}
              onEditDraftChange={onEditDraftChange}
              onActivityDraftChange={onActivityDraftChange}
              onStartEditing={onStartEditing}
              onCancelEditing={onCancelEditing}
              onSaveEdits={onSaveEdits}
              onStartEditingActivity={onStartEditingActivity}
              onCancelEditingActivity={onCancelEditingActivity}
              onSaveActivityEdits={onSaveActivityEdits}
              onUpdate={onUpdate}
              onToggleClosed={onToggleClosed}
              onDelete={onDelete}
              onToggleHistory={onToggleHistory}
              onAddActivity={onAddActivity}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ApplicationList
