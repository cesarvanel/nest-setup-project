import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export interface Session {
  userId: string | null
  csrfToken: string
}

interface SessionContextValue {
  session: Session | null
  loading: boolean
  refresh: () => Promise<void>
  apiFetch: (url: string, options?: RequestInit) => Promise<Response>
  logout: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const refresh = (): Promise<void> =>
    fetch('/api/session')
      .then(async (res) => {
        const csrfToken = res.headers.get(import.meta.env.VITE_COOKIE_NAME) ?? ''
        const data: { userId: string | null } = await res.json()
        setSession({ userId: data.userId, csrfToken })
      })
      .finally(() => setLoading(false))

  useEffect(() => { refresh() }, [])

  const apiFetch = (url: string, options: RequestInit = {}): Promise<Response> =>
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': session?.csrfToken ?? '',
        ...options.headers,
      },
    }).then(async (res) => {
      if (res.status === 401) await refresh()
      return res
    })

  const logout = async () => {
    const res = await apiFetch('/api/auth/logout', { method: 'POST' })
    if (res.ok) {
      await refresh()
      navigate('/')
    }
  }

  return (
    <SessionContext.Provider value={{ session, loading, refresh, apiFetch, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
