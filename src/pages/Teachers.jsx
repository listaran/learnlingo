import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import TeacherList from '../components/teachers/TeacherList.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useTeachers } from '../hooks/useTeachers.js'
import { languages, levels } from '../services/teachers.js'

const initialFilters = { language: '', level: '', price: '' }

export default function Teachers({ onGuestFavorite, onBook }) {
  const [filters, setFilters] = useState(initialFilters)
  const { user, favoriteIds, toggleFavorite } = useAuth()
  const { teachers, hasMore, loading, error, loadMore, retry } = useTeachers(filters)
  const onFavorite = (id) => user ? toggleFavorite(id) : onGuestFavorite()

  return <main className="catalog-main container">
    <div className="page-heading"><div><span className="section-kicker">Find your fit</span><h1>Our teachers</h1></div><p>Explore teachers who can help you speak with confidence.</p></div>
    <div className="filters" aria-label="Filter teachers">
      <label><span>Languages</span><span className="select-wrap"><select value={filters.language} onChange={(event) => setFilters({ ...filters, language: event.target.value })}><option value="">All languages</option>{languages.map((language) => <option key={language}>{language}</option>)}</select><ChevronDown size={18} /></span></label>
      <label><span>Level of knowledge</span><span className="select-wrap"><select value={filters.level} onChange={(event) => setFilters({ ...filters, level: event.target.value })}><option value="">All levels</option>{levels.map((level) => <option key={level}>{level}</option>)}</select><ChevronDown size={18} /></span></label>
      <label><span>Price</span><span className="select-wrap"><select value={filters.price} onChange={(event) => setFilters({ ...filters, price: event.target.value })}><option value="">Any price</option><option value="25">Up to 25 $</option><option value="30">Up to 30 $</option><option value="35">Up to 35 $</option></select><ChevronDown size={18} /></span></label>
    </div>
    {error && <div className="error-state" role="alert"><p>{error}</p><button type="button" className="button button-primary" onClick={retry}>Try again</button></div>}
    {loading && teachers.length === 0 ? <div className="loading-state" role="status">Loading teachers...</div> : !error && <TeacherList teachers={teachers} favorites={favoriteIds} onFavorite={onFavorite} onBook={onBook} selectedLevel={filters.level} emptyText="Try another language, level, or price." />}
    {hasMore && !error && <div className="load-more-row"><button type="button" className="button button-primary" onClick={loadMore} disabled={loading}>{loading ? 'Loading...' : 'Load more'}</button></div>}
  </main>
}
