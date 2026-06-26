import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import { useSession } from '@/context/SessionContext'
import './App.css'

function App() {
  const { loading } = useSession()

  if (loading) return null

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
