import { useState, useEffect } from 'react'
import type { Session } from '@/hooks/useSession'
import './Profile.css'

interface ProfileData {
  userId: string
  displayName: string
  bio: string
  avatar: number
}

interface Props {
  session: Session
  apiFetch: (url: string, options?: RequestInit) => Promise<Response>
}

function Profile({ session, apiFetch }: Props) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ displayName: '', bio: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    apiFetch('/api/profile')
      .then((res) => res.json())
      .then((data: ProfileData) => {
        setProfile(data)
        setForm({ displayName: data.displayName, bio: data.bio })
      })
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    const res = await apiFetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify({ ...profile, ...form }),
    })
    if (res.ok) {
      const updated: ProfileData = await res.json()
      setProfile(updated)
      setEditing(false)
    }
    setSaving(false)
  }

  if (!profile) return <div className="profile-loading">Chargement…</div>

  return (
    <section id="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={`https://i.pravatar.cc/150?img=${profile.avatar}`} alt="Avatar" />
          </div>
          <div className="profile-info">
            {editing ? (
              <input
                className="profile-edit-input"
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                placeholder="Nom affiché"
              />
            ) : (
              <h1>{profile.displayName}</h1>
            )}
            <p className="username">@{session.userId}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Bio</h2>
            {editing ? (
              <textarea
                className="profile-edit-textarea"
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3}
                placeholder="Décrivez-vous…"
              />
            ) : (
              <p>{profile.bio || 'Aucune bio renseignée.'}</p>
            )}
          </div>

          <div className="profile-actions">
            {editing ? (
              <>
                <button className="btn-edit" onClick={handleSave} disabled={saving}>
                  {saving ? 'Sauvegarde…' : 'Sauvegarder'}
                </button>
                <button className="btn-settings" onClick={() => setEditing(false)}>
                  Annuler
                </button>
              </>
            ) : (
              <button className="btn-edit" onClick={() => setEditing(true)}>
                Modifier le profil
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile
