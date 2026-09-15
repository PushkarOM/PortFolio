import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import DesktopBackground from '../features/desktop/components/DesktopBackground'
import BootScreen from '../features/desktop/components/BootScreen'
import TopBar from '../features/desktop/components/TopBar'
import DesktopIcons from '../features/desktop/components/DesktopIcons'
import HeroWindow from '../features/portfolio/components/HeroWindow'
import TerminalWindow from '../features/portfolio/components/TerminalWindow'
import SideWidgets from '../features/desktop/components/SideWidgets'
import BottomDock from '../features/desktop/components/BottomDock'
import ProjectsWindow from '../features/portfolio/components/ProjectsWindow'
import ExperienceWindow from '../features/portfolio/components/ExperienceWindow'
import SkillsWindow from '../features/portfolio/components/SkillsWindow'
import ResumeWindow from '../features/portfolio/components/ResumeWindow'
import ContactWindow from '../features/portfolio/components/ContactWindow'
import WindowFrame from '../shared/components/WindowFrame'
import NekoKat from '../features/desktop/components/NekoKat'
import LockScreen from '../features/desktop/components/LockScreen'
import { useWindowManager, WindowId } from '../context/WindowContext'

// F3: Lazy-load StudioCMS — it's heavy and only needed when the user opens it
const StudioCMS = lazy(() => import('../features/cms/components/StudioCMS'))

type Theme = 'aurora' | 'midnight' | 'retro' | 'matrix'

// F2: Lightweight in-app toast to replace browser alert()
function showToast(message: string) {
  const el = document.createElement('div')
  el.textContent = message
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '90px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(30,35,51,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e2e8f0',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    padding: '8px 18px',
    borderRadius: '8px',
    zIndex: '99999',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    pointerEvents: 'none',
    transition: 'opacity 0.3s',
  })
  document.body.appendChild(el)
  setTimeout(() => { el.style.opacity = '0' }, 1700)
  setTimeout(() => document.body.removeChild(el), 2000)
}

export default function App() {
  const [bootDone, setBootDone] = useState(false)
  const [theme, setTheme] = useState<Theme>('aurora')
  const [isMobile, setIsMobile] = useState(false)

  const {
    windows,
    activeWindowId,
    openWindow,
  } = useWindowManager()

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'aurora' ? '' : theme)
  }, [theme])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // E8: stable callback reference — prevents BootScreen from re-rendering every render cycle
  const handleBootComplete = useCallback(() => setBootDone(true), [])

  const handleThemeChange = useCallback((t: string) => {
    if (['aurora', 'midnight', 'retro', 'matrix'].includes(t)) {
      setTheme(t as Theme)
    }
  }, [])

  // Stable derived value — avoids re-computing on every render
  const activeNavSection = useMemo(() => {
    if (!activeWindowId) return 'Home'
    switch (activeWindowId) {
      case 'home': return 'Home'
      case 'projects': return 'Projects'
      case 'experience': return 'Experience'
      case 'skills': return 'Skills'
      case 'resume': return 'Resume'
      case 'contact': return 'Contact'
      default: return 'Home'
    }
  }, [activeWindowId])

  const handleNavClick = useCallback((section: string) => {
    const sectionToWindowId: Record<string, WindowId> = {
      'Home': 'home',
      'Projects': 'projects',
      'Experience': 'experience',
      'Skills': 'skills',
      'Resume': 'resume',
      'Contact': 'contact',
    }
    const winId = sectionToWindowId[section]
    if (winId) openWindow(winId)
  }, [openWindow])

  // F4: Memoized Set — stable reference so BottomDock doesn't re-render on unrelated context updates
  const openWindowIds = useMemo(
    () => new Set(windows.filter(w => w.isOpen && !w.isMinimized).map(w => w.id)),
    [windows]
  )

  // Stable callback for DesktopIcons — avoids recreating on every App render
  const handleDesktopIconOpen = useCallback((id: string) => {
    const mappedId = id.toLowerCase()
    if (mappedId === 'trash') {
      showToast('🗑️ Trash is empty!')
    } else {
      openWindow(mappedId as WindowId)
    }
  }, [openWindow])

  return (
    <>
      <BootScreen onComplete={handleBootComplete} />

      {bootDone && (
        <>
          <LockScreen idleTimeoutMs={60000} />
          <div
            className="desktop-grid desktop-reveal"
          style={{
            width: '100vw',
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            color: 'var(--text-primary)',
            position: 'relative',
          }}
        >
          {/* Background — pixel wallpaper + doodles + parallax (z=0, behind everything) */}
          <DesktopBackground />

          {/* Top bar */}
          <TopBar
            activeSection={activeNavSection}
            onSectionChange={handleNavClick}
            theme={theme}
            onThemeChange={handleThemeChange}
          />

          {/* Main workspace */}
          <div style={{
            flex: 1,
            display: 'flex',
            gap: 0,
            overflow: 'hidden',
            minHeight: 0,
          }}>
            {/* Left: Desktop Icons */}
            {!isMobile && (
              <>
                <DesktopIcons onOpen={handleDesktopIconOpen} />
                {/* Divider */}
                <div style={{ width: 1, background: 'var(--border-light)', opacity: 0.4, flexShrink: 0 }} />
              </>
            )}

            {/* Center: Main desktop area */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 10,
              overflow: 'hidden',
              minWidth: 0,
            }}>
            {/* Empty canvas — wallpaper, doodles and wordmark all live in DesktopBackground */}
            <div style={{ flex: 1 }} />
            </div>

            {/* Right: Widgets */}
            {!isMobile && (
              <>
                {/* Divider */}
                <div style={{ width: 1, background: 'var(--border-light)', opacity: 0.4, flexShrink: 0 }} />
                <SideWidgets />
              </>
            )}
          </div>

          {/* Bottom Dock — receives live open-window IDs for active dots (F4) */}
          <BottomDock
            onOpenTerminal={() => openWindow('terminal')}
            onOpenProjects={() => openWindow('projects')}
            onOpenContact={() => openWindow('contact')}
            onOpenResume={() => openWindow('resume')}
            onOpenSettings={() => openWindow('studio')}
            openWindowIds={openWindowIds}
          />

          {/* Draggable Windows Overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
            <AnimatePresence>
              {windows
                .filter(win => win.isOpen && !win.isMinimized)
                .map(win => {
                  const renderContent = () => {
                    switch (win.id) {
                      case 'home':
                        return (
                          <HeroWindow
                            onOpenTerminal={() => openWindow('terminal')}
                            onOpenProjects={() => openWindow('projects')}
                          />
                        )
                      case 'projects':
                        return <ProjectsWindow />
                      case 'experience':
                        return <ExperienceWindow />
                      case 'skills':
                        return <SkillsWindow />
                      case 'resume':
                        return <ResumeWindow />
                      case 'contact':
                        return <ContactWindow />
                      case 'terminal':
                        return <TerminalWindow onThemeChange={handleThemeChange} />
                      case 'studio':
                        // F3: StudioCMS is lazy-loaded — show a minimal spinner while the chunk loads
                        return (
                          <Suspense fallback={
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                              Loading Studio CMS...
                            </div>
                          }>
                            <StudioCMS />
                          </Suspense>
                        )
                      default:
                        return null
                    }
                  }

                  return (
                    <WindowFrame
                      key={win.id}
                      id={win.id}
                      title={win.title}
                      zIndex={win.zIndex}
                      isOpen={win.isOpen}
                      isMinimized={win.isMinimized}
                      isMaximized={win.isMaximized}
                      x={win.x}
                      y={win.y}
                      width={win.width}
                      height={win.height}
                      spawnOrigin={win.spawnOrigin}
                    >
                      <div style={{ pointerEvents: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {renderContent()}
                      </div>
                    </WindowFrame>
                  )
                })}
            </AnimatePresence>
          </div>
        </div>
      </>
      )}

      {/* Neko cat — follows cursor, pointer-events:none, skips if reduced-motion */}
      {bootDone && <NekoKat />}
    </>
  )
}
