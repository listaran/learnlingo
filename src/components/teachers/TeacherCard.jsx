import { useState } from 'react'
import { BookOpen, Heart, Star } from 'lucide-react'

export default function TeacherCard({ teacher, isFavorite, onFavorite, onBook, selectedLevel = '' }) {
  const [expanded, setExpanded] = useState(false)
  const name = `${teacher.name} ${teacher.surname}`
  const highlightedLevel = selectedLevel || teacher.levels[0]

  return <article className={`teacher-card ${expanded ? 'expanded' : ''}`}>
    <div className="teacher-avatar"><img src={teacher.avatar_url} alt={`Portrait of ${name}`} loading="lazy" /><span className="online-dot" aria-label="Available online" /></div>
    <div className="teacher-body">
      <div className="teacher-topline"><div className="teacher-identity"><span className="eyebrow">Languages</span><h2>{name}</h2></div><div className="teacher-facts"><span><BookOpen size={15} />Lessons online</span><span>Lessons done: <b>{teacher.lessons_done}</b></span><span><Star size={15} className="star" fill="currentColor" /> Rating: <b>{Number(teacher.rating).toFixed(1)}</b></span><span>Price / 1 hour: <b className="price">{teacher.price_per_hour}$</b></span></div></div>
      <div className="teacher-details"><p><span>Speaks:</span> <strong className="spoken-languages">{teacher.languages.join(', ')}</strong></p><p><span>Lesson Info:</span> {teacher.lesson_info}</p><p><span>Conditions:</span> {teacher.conditions.join(' ')}</p></div>
      {expanded && <div className="teacher-expanded"><p>{teacher.experience}</p><div className="reviews">{teacher.reviews?.length ? teacher.reviews.map((review, index) => <div className="review" key={`${review.reviewer_name}-${index}`}><div><strong>{review.reviewer_name}</strong><span><Star size={13} fill="currentColor" /> {Number(review.reviewer_rating).toFixed(1)}</span></div><p>{review.comment}</p></div>) : <p>No reviews yet.</p>}</div></div>}
      <button className="read-more" type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? 'Show less' : 'Read more'}</button>
      <div className="level-list" aria-label="Supported levels">{teacher.levels.map((level) => <span className={level === highlightedLevel ? 'highlight' : ''} key={level}>#{level}</span>)}</div>
      {expanded && <button className="button button-primary booking-button" type="button" onClick={() => onBook(teacher)}>Book trial lesson</button>}
    </div>
    <button className={`favorite-button icon-button ${isFavorite ? 'active' : ''}`} type="button" onClick={() => onFavorite(teacher.id)} aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`} aria-pressed={isFavorite}><Heart size={23} fill={isFavorite ? 'currentColor' : 'none'} /></button>
  </article>
}
