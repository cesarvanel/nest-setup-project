import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSession } from '@/context/SessionContext'
import './Login.css'

function Login() {
  const { session, refresh, apiFetch } = useSession()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (session?.userId) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    setLoading(false)
    if (res.ok) {
      refresh()
    } else {
      const data = await res.json()
      setError(data.message ?? 'Erreur de connexion')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-header">
          <h1>Connexion</h1>
          <p>Entrez vos identifiants pour accéder à votre espace</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
          {error && <div className="login-error">⚠ {error}</div>}
        </form>
      </div>
    </div>
  )
}

export default Login
