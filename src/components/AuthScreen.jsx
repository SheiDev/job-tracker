import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from './Icons.jsx'

function PasswordField({ label, value, onChange, autoComplete, minLength, shown, onToggle, showLabel, hideLabel }) {
  return (
    <label>
      {label}
      <span className="password-field">
        <input
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          minLength={minLength}
          required
        />
        <button
          className="password-toggle"
          type="button"
          aria-label={shown ? hideLabel : showLabel}
          title={shown ? hideLabel : showLabel}
          onClick={onToggle}
        >
          {shown ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </span>
    </label>
  )
}

function AuthScreen({ copy, onRegister, onLogin }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const isRegister = mode === 'register'
  const passwordRules = [
    { id: 'length', ok: password.length >= 8, label: copy.ruleLength },
    { id: 'upper', ok: /[A-Z]/.test(password), label: copy.ruleUpper },
    { id: 'number', ok: /\d/.test(password), label: copy.ruleNumber },
    { id: 'symbol', ok: /[^A-Za-z0-9]/.test(password), label: copy.ruleSymbol },
  ]
  const missingPasswordRules = passwordRules.filter((rule) => !rule.ok)
  const passwordIsWeak = isRegister && missingPasswordRules.length > 0
  const passwordsDoNotMatch =
    isRegister && confirmPassword.length > 0 && password !== confirmPassword

  async function handleSubmit(event) {
    event.preventDefault()
    if (passwordIsWeak || passwordsDoNotMatch) return

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
        <PasswordField
          label={copy.password}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          shown={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
          showLabel={copy.showPassword}
          hideLabel={copy.hidePassword}
        />
        {isRegister && password.length > 0 && missingPasswordRules.length > 0 && (
          <ul className="password-rules">
            {missingPasswordRules.map((rule) => (
              <li key={rule.id}>{rule.label}</li>
            ))}
          </ul>
        )}
        {isRegister && (
          <PasswordField
            label={copy.confirmPassword}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            shown={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((current) => !current)}
            showLabel={copy.showPassword}
            hideLabel={copy.hidePassword}
          />
        )}
        {passwordsDoNotMatch && <p className="form-error">{copy.passwordMismatch}</p>}
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
    </section>
  )
}

export default AuthScreen
