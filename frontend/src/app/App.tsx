import { useState, useEffect } from 'react'
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
import StudioCMS from '../features/cms/components/StudioCMS'
import WindowFrame from '../shared/components/WindowFrame'
import { useWindowManager, WindowId } from '../context/WindowContext'

type Theme = 'aurora' | 'midnight' | 'retro' | 'matrix'

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

  const handleThemeChange = (t: string) => {
    if (['aurora', 'midnight', 'retro', 'matrix'].includes(t)) {
      setTheme(t as Theme)
    }
  }

  const getActiveNavSection = () => {
    if (!activeWindowId) return 'Home'
    switch (activeWindowId) {
      case 'home': return 'Home'
      case 'projects': return 'Projects'
      case 'experience': return 'Experience'
      case 'skills': return 'Skills'
      case 'contact': return 'Contact'
      default: return 'Home'
    }
  }

  const handleNavClick = (section: string) => {
    const sectionToWindowId: Record<string, WindowId> = {
      'Home': 'home',
      'Projects': 'projects',
      'Experience': 'experience',
      'Skills': 'skills',
      'Contact': 'contact',
    }
    const winId = sectionToWindowId[section]
    if (winId) {
      openWindow(winId)
    }
  }

  return (
    <>
      <BootScreen onComplete={() => setBootDone(true)} />

      {bootDone && (
        <div
          className="desktop-grid desktop-reveal"
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            color: 'var(--text-primary)',
            position: 'relative',
          }}
        >
          {/* Top bar */}
          <TopBar
            activeSection={getActiveNavSection()}
            onSectionChange={handleNavClick}
            theme={theme}
            onThemeChange={setTheme}
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
                <DesktopIcons
                  onOpen={(id) => {
                    const mappedId = id.toLowerCase()
                    if (mappedId === 'trash') {
                      alert('Trash is empty!')
                    } else {
                      openWindow(mappedId as WindowId)
                    }
                  }}
                />
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
              {/* This space is left for wallpaper to show through under windows */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.05,
                pointerEvents: 'none',
                userSelect: 'none',
              }}>
                <span style={{ fontSize: 24, fontFamily: 'var(--font-display)', fontWeight: 800 }}>PushkarOS</span>
              </div>
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

          {/* Bottom Dock */}
          <BottomDock
            onOpenTerminal={() => openWindow('terminal')}
            onOpenProjects={() => openWindow('projects')}
            onOpenContact={() => openWindow('contact')}
            onOpenResume={() => openWindow('resume')}
            onOpenSettings={() => openWindow('studio')}
          />

          {/* Draggable Windows Overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
            {windows.map(win => {
              if (!win.isOpen) return null

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
                    return <StudioCMS />
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
                >
                  <div style={{ pointerEvents: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {renderContent()}
                  </div>
                </WindowFrame>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
