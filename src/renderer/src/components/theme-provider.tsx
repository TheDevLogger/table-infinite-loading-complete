import { createContext, useContext, useEffect, useState } from 'react'

const initialState: ThemeProviderState = {
  theme: { mode: 'dark', color: 'yellow' },
  setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = { mode: 'light', color: 'yellow' },
  storageKey = 'distort-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme.mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme.mode)
  }, [theme.mode])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    }
  }

  if (theme.mode === 'system') {
    const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    return (
      <ThemeProviderContext.Provider {...props} value={value}>
        <div data-theme={`${theme.color}-${systemMode}`}>{children}</div>
      </ThemeProviderContext.Provider>
    )
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <div className={`${theme.mode}`} data-theme={`${theme.color}-${theme.mode}`}>
        {children}
      </div>
    </ThemeProviderContext.Provider>
  )
}

/**
 * Hook to get and set new theme throughout application
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
