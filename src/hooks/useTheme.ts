import { useEffect, useState } from 'react'
import type { Theme } from '../types/theme'

const THEME_KEY = 'theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem(THEME_KEY) as Theme) || 'system'
  })

  useEffect(() => {
    const root = document.documentElement

    function applyTheme(mode: Theme) {
      const isDark =
        mode === 'dark' ||
        (mode === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)

      root.classList.toggle('dark', isDark)
    }

    applyTheme(theme)

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => applyTheme('system')
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    }
  }, [theme])

  function changeTheme(value: Theme) {
    setTheme(value)
    localStorage.setItem(THEME_KEY, value)
  }

  return { theme, changeTheme }
}
