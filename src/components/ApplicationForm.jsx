import { PlusIcon } from './Icons.jsx'

function ApplicationForm({
  copy,
  company,
  role,
  link,
  onCompanyChange,
  onRoleChange,
  onLinkChange,
  onSubmit,
}) {
  return (
    <section className="panel new-application-panel">
      <div className="section-heading">
        <h2>{copy.newApplication}</h2>
      </div>
      <form className="application-form" onSubmit={onSubmit}>
        <label>
          {copy.company}
          <input
            id="company"
            value={company}
            onChange={onCompanyChange}
            placeholder={copy.companyPlaceholder}
            required
          />
        </label>
        <label>
          {copy.role}
          <input
            id="role"
            value={role}
            onChange={onRoleChange}
            placeholder={copy.rolePlaceholder}
            required
          />
        </label>
        <label className="wide-field">
          {copy.applicationLink}{' '}
          <span className="optional-label">{copy.optional}</span>
          <input
            id="link"
            type="url"
            value={link}
            onChange={onLinkChange}
            placeholder="https://company.com/jobs/..."
          />
        </label>
        <button className="button button-primary submit-button" type="submit">
          <PlusIcon />
          {copy.saveApplication}
        </button>
      </form>
    </section>
  )
}

export default ApplicationForm
