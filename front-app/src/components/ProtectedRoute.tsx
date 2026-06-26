import { Navigate } from 'react-router-dom'
import { useSession } from '@/context/SessionContext'

interface Props {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const { session } = useSession()
  if (!session?.userId) return <Navigate to="/login" replace />
  return <>{children}</>
}
