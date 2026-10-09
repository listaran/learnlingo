import { LogIn, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function Header({ openAuth }) {
  const { user, loading, logout, favoriteIds } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="header-inner container">
        <NavLink to="/" className="brand" onClick={closeMenu} aria-label="LearnLingo home"><span className="brand-mark" aria-hidden="true" /><span>LearnLingo</span></NavLink>
        <button className="mobile-menu-toggle icon-button" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
        <div className={`header-links ${menuOpen ? 'open' : ''}`}>
          <nav className="primary-nav" aria-label="Main navigation"><NavLink to="/" end onClick={closeMenu}>Home</NavLink><NavLink to="/teachers" onClick={closeMenu}>Teachers</NavLink>{user && <NavLink to="/favorites" onClick={closeMenu}>Favorites <span className="favorite-count">{favoriteIds.length}</span></NavLink>}</nav>
          <div className="header-actions">{!loading && (user ? <><span className="user-name">{user.displayName || user.email}</span><button className="text-action" type="button" onClick={() => { logout(); closeMenu() }}>Log out</button></> : <><button className="text-action login-action" type="button" onClick={() => { openAuth('login'); closeMenu() }}><LogIn size={18} />Log in</button><button className="button button-dark" type="button" onClick={() => { openAuth('register'); closeMenu() }}>Registration</button></>)}</div>
        </div>
      </div>
    </header>
  )
}
