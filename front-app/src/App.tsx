import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import { useSession } from '@/hooks/useSession'
import './App.css'

function App() {
  const { session, loading, refresh, apiFetch } = useSession()

  const handleLogout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' })
    refresh()
  }

  if (loading) return null

  return (
    <BrowserRouter>
      <Navbar session={session} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home session={session} />} />
        <Route path="/login" element={<Login session={session} refresh={refresh} apiFetch={apiFetch} />} />
        <Route path="/profile" element={
          <ProtectedRoute session={session}>
            <Profile session={session!} apiFetch={apiFetch} />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute session={session}>
            <Settings session={session!} />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
