import { useEffect, useState } from 'react'
import { getStorage, setStorage, removeStorage } from '../utils/storage'
import type { User } from '../types/user'

const AUTH_KEY = 'auth'

const STATIC_CREDENTIAL = {
  username: 'admin',
  password: 'admin123',
  fullName: 'Administrator',
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = getStorage<{ user: User }>(AUTH_KEY)
    return saved?.user || null
  })

  useEffect(() => {
    const saved = getStorage<{ user: User }>(AUTH_KEY)
    if (saved?.user) {
      setUser(saved.user)
    }
  }, [])

  function login(username: string, password: string): boolean {
    if (
      username === STATIC_CREDENTIAL.username &&
      password === STATIC_CREDENTIAL.password
    ) {
      const userData = {
        username,
        fullName: STATIC_CREDENTIAL.fullName,
      }
      setUser(userData)
      setStorage(AUTH_KEY, { user: userData })
      return true
    }
    return false
  }

  function logout() {
    setUser(null)
    removeStorage(AUTH_KEY)
  }

  function updateProfile(fullName: string) {
    if (!user) return
    const updated = { ...user, fullName }
    setUser(updated)
    setStorage(AUTH_KEY, { user: updated })
  }

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
  }
}
