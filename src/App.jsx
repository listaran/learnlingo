import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import AuthModal from './components/modals/AuthModal.jsx'
import BookingModal from './components/modals/BookingModal.jsx'
import { useAuth } from './contexts/AuthContext.jsx'
import Favorites from './pages/Favorites.jsx'
import Home from './pages/Home.jsx'
import Teachers from './pages/Teachers.jsx'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-state" role="status">Loading account...</div>
  return user ? children : <Navigate to="/teachers" replace />
}

export default function App() {
  const [authMode, setAuthMode] = useState(null)
  const [authNotice, setAuthNotice] = useState('')
  const [bookingTeacher, setBookingTeacher] = useState(null)

  const openAuth = (mode) => { setAuthMode(mode); setAuthNotice('') }
  const openGuestFavorite = () => { setAuthMode('login'); setAuthNotice('Sign in or register to save your favorite teachers.') }

  return <>
    <Header openAuth={openAuth} />
    <Routes><Route path="/" element={<Home />} /><Route path="/teachers" element={<Teachers onGuestFavorite={openGuestFavorite} onBook={setBookingTeacher} />} /><Route path="/favorites" element={<PrivateRoute><Favorites onBook={setBookingTeacher} /></PrivateRoute>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>
    {authMode && <AuthModal key={authMode} mode={authMode} notice={authNotice} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} />}
    {bookingTeacher && <BookingModal teacher={bookingTeacher} onClose={() => setBookingTeacher(null)} />}
  </>
}
