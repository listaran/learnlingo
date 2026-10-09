import TeacherCard from './TeacherCard.jsx'

export default function TeacherList({ teachers, favorites, onFavorite, onBook, emptyText }) {
  if (!teachers.length) return <div className="empty-state"><h2>No teachers found</h2><p>{emptyText}</p></div>
  return <div className="teacher-list">{teachers.map((teacher) => <TeacherCard key={teacher.id} teacher={teacher} isFavorite={favorites.includes(teacher.id)} onFavorite={onFavorite} onBook={onBook} />)}</div>
}
