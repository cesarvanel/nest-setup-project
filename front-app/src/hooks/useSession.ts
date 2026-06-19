import { useEffect, useState } from 'react'

export interface Session {
  userId: string | null
  csrfToken: string
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = () =>
    fetch('/api/session')
      .then((res) => {
        const csrfToken = res.headers.get('X-CSRF-Token') ?? ''
        const userId = res.headers.get('X-User-Id') ?? null
        setSession({ userId, csrfToken })
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
      if (res.status === 401) {
        await refresh()
      }
      return res
    })

  return { session, loading, refresh, apiFetch }
}
