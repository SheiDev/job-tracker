import { useState } from 'react'
import { PlusIcon } from './Icons.jsx'

function ApplicationForm({ copy, onAdd }) {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [link, setLink] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onAdd({ company, role, link })
    setCompany('')
    setRole('')
    setLink('')
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>{copy.newApplication}</h2>
      </div>
      <form className="application-form" onSubmit={handleSubmit}>
        <label>
          {copy.company}
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder={copy.companyPlaceholder}
            required
          />
        </label>
        <label>
          {copy.role}
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder={copy.rolePlaceholder}
            required
          />
        </label>
        <label className="wide-field">
          {copy.applicationLink}{' '}
          <span className="optional-label">{copy.optional}</span>
          <input
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
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
