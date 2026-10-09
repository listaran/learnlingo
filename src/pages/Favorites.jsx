import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TeacherList from '../components/teachers/TeacherList.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { getTeachersByIds } from '../services/teachers.js'

export default function Favorites({ onBook }) {
  const { favoriteIds, toggleFavorite } = useAuth()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const key = favoriteIds.join('|')

  useEffect(() => {
    let active = true
    setLoading(true)
    getTeachersByIds(favoriteIds).then((data) => {
      if (active) { setTeachers(data); setError(''); setLoading(false) }
    }).catch(() => {
      if (active) { setError('Favorites could not be loaded. Please refresh and try again.'); setLoading(false) }
    })
    return () => { active = false }
  }, [key])

  return <main className="catalog-main container"><div className="page-heading"><div><span className="section-kicker">Your shortlist</span><h1>Favorite teachers</h1></div><p>Keep the teachers you love close at hand.</p></div>{error && <div className="error-state" role="alert">{error}</div>}{loading ? <div className="loading-state" role="status">Loading favorites...</div> : !error && (teachers.length ? <TeacherList teachers={teachers} favorites={favoriteIds} onFavorite={toggleFavorite} onBook={onBook} /> : <div className="empty-state"><h2>No favorites yet</h2><p>Browse teachers and select the heart on anyone you want to save.</p><Link className="button button-primary" to="/teachers">Explore teachers</Link></div>)}</main>
}
