import { useState } from 'react'

function AuthScreen({ copy, onRegister, onLogin }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isRegister = mode === 'register'

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      if (isRegister) {
        await onRegister({ name, email, password })
      } else {
        await onLogin({ email, password })
      }
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <section className="panel auth-panel">
      <div className="section-heading">
        <h2>{isRegister ? copy.registerTitle : copy.loginTitle}</h2>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {isRegister && (
          <label>
            {copy.name}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              minLength={2}
              required
            />
          </label>
        )}
        <label>
          {copy.email}
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          {copy.password}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            minLength={isRegister ? 8 : undefined}
            required
          />
        </label>
        <button className="button button-primary" type="submit" disabled={submitting}>
          {isRegister ? copy.registerAction : copy.loginAction}
        </button>
      </form>
      <button
        className="text-toggle auth-switch"
        type="button"
        onClick={() => setMode(isRegister ? 'login' : 'register')}
      >
        {isRegister ? copy.haveAccount : copy.needAccount}
      </button>
      <p className="auth-hint">{copy.authHint}</p>
    </section>
  )
}

export default AuthScreen
