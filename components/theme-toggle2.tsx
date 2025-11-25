import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

// If you uploaded an image, the path is available here:
// const previewImg = "/mnt/data/original-c1ce1039d9254c51c10c1609746a6526.webp"

interface ThemeToggleProps {
  toggleTheme?: () => void
  isDark?: boolean
}

export function ThemeToggle({ toggleTheme, isDark: isDarkProp }: ThemeToggleProps = {}) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  // Use prop if provided, otherwise use theme hook
  const isDark = isDarkProp !== undefined ? isDarkProp : (theme || resolvedTheme) === 'dark'
  const handleToggle = toggleTheme || (() => setTheme(isDark ? 'light' : 'dark'))

  return (
    <div className="flex items-center justify-center h-full">
      <button
        aria-label="Toggle theme"
        onClick={handleToggle}
        className="relative w-11 h-6 rounded-full p-0.5 transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          boxShadow: isDark
            ? 'inset 0 1px 0 rgba(255,255,255,0.02), 0 2px 8px rgba(0,0,0,0.25)'
            : 'inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        {/* Background track */}
        <div
          className={`absolute inset-0 rounded-full overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600' : 'bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400'
            }`}
        >
          {/* decorative clouds / stars (pure CSS shapes) */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
            {/* Night layer: stars */}
            <div className="w-full h-full relative">
              {/* small stars */}
              <div className="absolute left-1 top-1.5 w-0.5 h-0.5 rounded-full bg-white opacity-80" />
              <div className="absolute left-2.5 top-2.5 w-0.5 h-0.5 rounded-full bg-white opacity-70" />
              <div className="absolute left-4 top-1 w-0.5 h-0.5 rounded-full bg-white opacity-80" />
              <div className="absolute left-6 top-2.5 w-0.5 h-0.5 rounded-full bg-white opacity-70" />
            </div>
          </div>

          <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
            {/* Day layer: clouds (soft shapes) */}
            <svg className="w-full h-full" viewBox="0 0 44 24" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <g fill="url(#g1)">
                <ellipse cx="22" cy="14" rx="13" ry="3" />
                <ellipse cx="35" cy="12" rx="6" ry="2" />
                <ellipse cx="9" cy="12" rx="7" ry="2.5" />
              </g>
            </svg>
          </div>
        </div>

        {/* Knob (sun / moon) */}
        <div
          className={`relative z-10 h-5 w-5 rounded-full shadow-md transform transition-all duration-500 ease-in-out flex items-center justify-center ${isDark ? 'translate-x-5 bg-gray-200' : 'translate-x-0 bg-yellow-400'
            }`}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
        >
          {/* Sun inner glow */}
          <div className={`absolute inset-0 rounded-full transition-opacity duration-400 ${isDark ? 'opacity-0' : 'opacity-100'}`} style={{ boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.08)' }} />

          {/* Moon craters shown only in dark mode */}
          <div className={`relative w-full h-full rounded-full overflow-hidden flex items-center justify-center ${isDark ? 'opacity-100' : 'opacity-0'}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#e6e7ea" />
              <circle cx="36" cy="40" r="6" fill="#cfcfd1" />
              <circle cx="62" cy="58" r="5" fill="#cfcfd1" />
              <circle cx="70" cy="34" r="3.5" fill="#d7d8da" />
            </svg>
          </div>

          {/* decorative tiny shadow to make it pop */}
          <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-3 h-1 rounded-full blur-sm opacity-20" />
        </div>

        {/* optional preview image overlay (for reference or background) */}
        {/* <img src={previewImg} alt="reference" className="pointer-events-none absolute right-0.5 bottom-0 h-3 opacity-0" /> */}
      </button>
    </div>
  )
}
