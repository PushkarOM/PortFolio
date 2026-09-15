import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export type WindowId = 'home' | 'projects' | 'experience' | 'skills' | 'resume' | 'contact' | 'studio' | 'terminal'

export interface WindowInstance {
  id: WindowId
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  x: number
  y: number
  width: number
  height: number
  icon?: string
  spawnOrigin?: { x: number; y: number }
}

interface WindowContextType {
  windows: WindowInstance[]
  activeWindowId: WindowId | null
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  maximizeWindow: (id: WindowId) => void
  focusWindow: (id: WindowId) => void
  updateWindowPosition: (id: WindowId, x: number, y: number) => void
  updateWindowSize: (id: WindowId, width: number, height: number) => void
}

export const PATH_TO_WINDOW: Record<string, WindowId> = {
  '/': 'home',
  '/home': 'home',
  '/projects': 'projects',
  '/experience': 'experience',
  '/skills': 'skills',
  '/resume': 'resume',
  '/contact': 'contact',
  '/terminal': 'terminal',
  '/studio': 'studio',
  '/settings': 'studio',
}

export const WINDOW_TO_PATH: Record<WindowId, string> = {
  home: '/',
  projects: '/projects',
  experience: '/experience',
  skills: '/skills',
  resume: '/resume',
  contact: '/contact',
  terminal: '/terminal',
  studio: '/studio',
}

const WINDOW_TITLES: Record<WindowId, string> = {
  home: 'PushkarOS — AI & Software Engineer',
  projects: 'Projects — PushkarOS',
  experience: 'Experience — PushkarOS',
  skills: 'Skills — PushkarOS',
  resume: 'Resume — PushkarOS',
  contact: 'Contact — PushkarOS',
  terminal: 'Terminal — PushkarOS',
  studio: 'Studio CMS — PushkarOS',
}

const DEFAULT_WINDOWS: WindowInstance[] = [
  {
    id: 'home',
    title: 'C:\\PUSHKAR\\about_me.exe',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    x: 40,
    y: 60,
    width: 780,
    height: 480,
  },
  {
    id: 'projects',
    title: 'C:\\Projects',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    x: 80,
    y: 90,
    width: 820,
    height: 520,
  },
  {
    id: 'experience',
    title: 'C:\\Experience\\timeline.md',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    x: 120,
    y: 120,
    width: 600,
    height: 460,
  },
  {
    id: 'skills',
    title: 'C:\\Skills\\stack.sh',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    x: 160,
    y: 150,
    width: 640,
    height: 440,
  },
  {
    id: 'resume',
    title: 'C:\\Resume\\pushkar_resume.pdf',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    x: 200,
    y: 80,
    width: 700,
    height: 550,
  },
  {
    id: 'contact',
    title: 'C:\\Contact\\compose_message.exe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    x: 240,
    y: 180,
    width: 640,
    height: 420,
  },
  {
    id: 'terminal',
    title: 'C:\\PUSHKAR\\terminal.exe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    x: 100,
    y: 240,
    width: 620,
    height: 380,
  },
  {
    id: 'studio',
    title: 'C:\\PUSHKAR\\studio_cms.exe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    x: 60,
    y: 70,
    width: 850,
    height: 560,
  },
]

const WindowContext = createContext<WindowContextType | undefined>(undefined)

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [windows, setWindows] = useState<WindowInstance[]>(DEFAULT_WINDOWS)
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('home')
  const [maxZIndex, setMaxZIndex] = useState(2)

  const isInternalNavigationRef = useRef(false)
  const lastClickOriginRef = useRef<{ x: number; y: number } | null>(null)

  // Global capture-phase click listener to track exact click coordinates for window spawn origins
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      lastClickOriginRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('click', handleGlobalClick, true)
    return () => window.removeEventListener('click', handleGlobalClick, true)
  }, [])

  // Sync open window state with current route pathname (direct link, back/forward)
  useEffect(() => {
    if (isInternalNavigationRef.current) {
      isInternalNavigationRef.current = false
      return
    }

    const targetId = PATH_TO_WINDOW[location.pathname] || 'home'

    if (WINDOW_TITLES[targetId]) {
      document.title = WINDOW_TITLES[targetId]
    }

    const nextZ = maxZIndex + 1
    setMaxZIndex(nextZ)
    setActiveWindowId(targetId)

    setWindows(prev =>
      prev.map(w => (w.id === targetId ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ } : w))
    )
  }, [location.pathname])

  // Helper to focus a window and navigate to its route
  const focusAndNavigate = (id: WindowId) => {
    const targetPath = WINDOW_TO_PATH[id] || '/'
    if (WINDOW_TITLES[id]) {
      document.title = WINDOW_TITLES[id]
    }

    const nextZ = maxZIndex + 1
    setMaxZIndex(nextZ)
    setActiveWindowId(id)

    const currentOrigin = lastClickOriginRef.current ? { ...lastClickOriginRef.current } : undefined

    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ, spawnOrigin: currentOrigin || w.spawnOrigin } : w))
    )

    if (location.pathname !== targetPath) {
      isInternalNavigationRef.current = true
      navigate(targetPath)
    }
  }

  const openWindow = (id: WindowId) => {
    focusAndNavigate(id)
  }

  const focusWindow = (id: WindowId) => {
    focusAndNavigate(id)
  }

  const closeWindow = (id: WindowId) => {
    setWindows(prev => {
      const updated = prev.map(w => (w.id === id ? { ...w, isOpen: false } : w))
      const remainingOpen = updated.filter(w => w.isOpen && !w.isMinimized)

      if (remainingOpen.length === 0) {
        // Zero open windows: auto-open Home and navigate URL to /
        const nextZ = maxZIndex + 1
        setMaxZIndex(nextZ)
        setActiveWindowId('home')
        if (WINDOW_TITLES['home']) document.title = WINDOW_TITLES['home']

        if (location.pathname !== '/') {
          isInternalNavigationRef.current = true
          navigate('/')
        }

        return updated.map(w => (w.id === 'home' ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ } : w))
      } else {
        // Shift focus and URL to highest remaining open window
        const highest = remainingOpen.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), remainingOpen[0])
        setActiveWindowId(highest.id)
        if (WINDOW_TITLES[highest.id]) document.title = WINDOW_TITLES[highest.id]

        const targetPath = WINDOW_TO_PATH[highest.id] || '/'
        if (location.pathname !== targetPath) {
          isInternalNavigationRef.current = true
          navigate(targetPath)
        }

        return updated
      }
    })
  }

  const minimizeWindow = (id: WindowId) => {
    setWindows(prev => {
      const updated = prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
      const openWins = updated.filter(w => w.isOpen && !w.isMinimized)

      if (openWins.length > 0) {
        const highest = openWins.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), openWins[0])
        setActiveWindowId(highest.id)
        if (WINDOW_TITLES[highest.id]) document.title = WINDOW_TITLES[highest.id]

        const targetPath = WINDOW_TO_PATH[highest.id] || '/'
        if (location.pathname !== targetPath) {
          isInternalNavigationRef.current = true
          navigate(targetPath)
        }
      } else {
        setActiveWindowId('home')
        if (location.pathname !== '/') {
          isInternalNavigationRef.current = true
          navigate('/')
        }
      }
      return updated
    })
  }

  const maximizeWindow = (id: WindowId) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)))
  }

  const updateWindowPosition = (id: WindowId, x: number, y: number) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, x, y } : w)))
  }

  const updateWindowSize = (id: WindowId, width: number, height: number) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, width, height } : w)))
  }

  return (
    <WindowContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
      }}
    >
      {children}
    </WindowContext.Provider>
  )
}

export function useWindowManager() {
  const context = useContext(WindowContext)
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowProvider')
  }
  return context
}
