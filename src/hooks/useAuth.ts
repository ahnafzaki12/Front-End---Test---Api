import { useState } from 'react'
import { getStorage, setStorage, removeStorage } from '../utils/storage'
import type { User } from '../types/user'
import { apiFetch } from "../services/api"


const AUTH_KEY = 'auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = getStorage<User>(AUTH_KEY)
    return saved || null
  })

  async function login(username: string, password: string) {
    try {
      const res = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      })

      const admin = res.data.admin
      const token = res.data.token

      localStorage.setItem("token", token)
      setStorage(AUTH_KEY, admin)

      setUser(admin)

      return true
    } catch (err) {
      return false
    }
  }

  async function logout() {
    try {
      await apiFetch("/logout", {
        method: "POST",
      })
    } catch { }

    localStorage.removeItem("token")
    removeStorage(AUTH_KEY)

    setUser(null)
  }

  function updateProfile(newName: string) {
    if (!user) return;

    const updatedUser = { ...user, name: newName };

    setUser(updatedUser);

    setStorage(AUTH_KEY, updatedUser);
  }

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
  }
}
