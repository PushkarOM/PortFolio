import React, { createContext, useContext, useState } from 'react'

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
  const [windows, setWindows] = useState<WindowInstance[]>(DEFAULT_WINDOWS)
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('home')
  const [maxZIndex, setMaxZIndex] = useState(2)

  // Focus helper
  const bringToFront = (id: WindowId, currentWindows: WindowInstance[]) => {
    const nextZ = maxZIndex + 1
    setMaxZIndex(nextZ)
    setActiveWindowId(id)
    return currentWindows.map(w => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w))
  }

  const openWindow = (id: WindowId) => {
    setWindows(prev => {
      const updated = prev.map(w => (w.id === id ? { ...w, isOpen: true, isMinimized: false } : w))
      return bringToFront(id, updated)
    })
  }

  const closeWindow = (id: WindowId) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isOpen: false } : w)))
    if (activeWindowId === id) {
      // Find the next highest Z-indexed open window to activate
      const openWins = windows.filter(w => w.id !== id && w.isOpen && !w.isMinimized)
      if (openWins.length > 0) {
        const highest = openWins.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), openWins[0])
        setActiveWindowId(highest.id)
      } else {
        setActiveWindowId(null)
      }
    }
  }

  const minimizeWindow = (id: WindowId) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w)))
    if (activeWindowId === id) {
      const openWins = windows.filter(w => w.id !== id && w.isOpen && !w.isMinimized)
      if (openWins.length > 0) {
        const highest = openWins.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), openWins[0])
        setActiveWindowId(highest.id)
      } else {
        setActiveWindowId(null)
      }
    }
  }

  const maximizeWindow = (id: WindowId) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)))
  }

  const focusWindow = (id: WindowId) => {
    setWindows(prev => bringToFront(id, prev))
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
