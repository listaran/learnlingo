import { Link } from 'react-router-dom'
import heroImage from '../assets/images/learner-hero.png'

const figures = [
  ['32,000+', 'Experienced tutors'],
  ['300,000+', '5-star tutor reviews'],
  ['120+', 'Subjects taught'],
  ['200+', 'Tutor nationalities'],
]

export default function Home() {
  return <main className="home-main container">
    <section className="home-hero" aria-labelledby="hero-title">
      <div className="hero-copy"><h1 id="hero-title">Unlock your potential with the best <em>language</em> tutors</h1><p>Take your next step with expert language teachers who make every lesson personal, practical, and inspiring.</p><Link className="button button-primary hero-cta" to="/teachers">Get started</Link></div>
      <div className="hero-art"><img src={heroImage} alt="A cheerful learner ready for an online lesson" /></div>
    </section>
    <section className="figures" aria-label="LearnLingo at a glance">{figures.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
  </main>
}
