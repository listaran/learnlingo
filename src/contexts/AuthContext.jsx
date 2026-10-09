import { createContext, useContext, useEffect, useState } from 'react'
import { loginAccount, logoutAccount, readFavoriteIds, registerAccount, restoreAccount, writeFavoriteIds } from '../services/accounts.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState([])

  useEffect(() => {
    let active = true
    restoreAccount().then(async (account) => {
      const ids = account ? await readFavoriteIds(account.uid) : []
      if (active) { setUser(account); setFavoriteIds(ids); setLoading(false) }
    }).catch(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function acceptAccount(account) {
    setUser(account)
    setFavoriteIds(await readFavoriteIds(account.uid))
  }

  async function toggleFavorite(id) {
    if (!user) return
    const next = favoriteIds.includes(id) ? favoriteIds.filter((item) => item !== id) : [...favoriteIds, id]
    await writeFavoriteIds(user.uid, next)
    setFavoriteIds(next)
  }

  return <AuthContext.Provider value={{
    user,
    loading,
    favoriteIds,
    login: async (email, password) => acceptAccount(await loginAccount(email, password)),
    register: async (name, email, password) => acceptAccount(await registerAccount(name, email, password)),
    logout: () => { logoutAccount(); setUser(null); setFavoriteIds([]) },
    toggleFavorite,
  }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
