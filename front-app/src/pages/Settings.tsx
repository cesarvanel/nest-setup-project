import { useSession } from '@/context/SessionContext'
import './Settings.css'

function Settings() {
  const { session } = useSession()

  return (
    <div className="settings-page">
      <h1>Paramètres</h1>

      <div className="settings-section">
        <h2>Compte</h2>
        <div className="settings-row">
          <span className="settings-label">Nom d'utilisateur</span>
          <span className="settings-badge">{session?.userId}</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">Statut</span>
          <span className="settings-badge">Connecté</span>
        </div>
      </div>

      <div className="settings-section">
        <h2>Préférences</h2>
        <div className="settings-row">
          <span className="settings-label">Thème</span>
          <span className="settings-value">Sombre</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">Langue</span>
          <span className="settings-value">Français</span>
        </div>
      </div>

      <div className="settings-section">
        <h2>Session</h2>
        <div className="settings-row">
          <span className="settings-label">Sécurité</span>
          <span className="settings-value">Session + CSRF activés</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">Stockage</span>
          <span className="settings-value">Mémoire (MemoryStore)</span>
        </div>
      </div>
    </div>
  )
}

export default Settings
