import { useState } from 'react'

interface DockItem {
  id: string
  label: string
  icon: React.ReactNode
  action?: () => void
  href?: string
}

interface Props {
  onOpenTerminal: () => void
  onOpenProjects: () => void
  onOpenContact: () => void
  onOpenResume: () => void
  onOpenSettings: () => void
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="18" rx="4" />
      <path d="M6 9l4 3-4 3M13 15h5" strokeLinecap="round" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7C3 5.9 3.9 5 5 5h4l2 2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function ResumeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <path d="M14 2v6h6M9 13h6M9 17h4" strokeLinecap="round" />
    </svg>
  )
}

export default function BottomDock({ onOpenTerminal, onOpenProjects, onOpenContact, onOpenResume, onOpenSettings }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const items: DockItem[] = [
    { id: 'terminal', label: 'Terminal', icon: <TerminalIcon />, action: onOpenTerminal },
    { id: 'projects', label: 'Projects', icon: <FolderIcon />, action: onOpenProjects },
    { id: 'github', label: 'GitHub', icon: <GitHubIcon />, href: 'https://github.com/PushkarOM' },
    { id: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon />, href: 'https://in.linkedin.com/in/pushkar-chaturvedi-a83778284' },
    { id: 'email', label: 'Email', icon: <MailIcon />, action: onOpenContact },
    { id: 'resume', label: 'Resume', icon: <ResumeIcon />, action: onOpenResume },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon />, action: onOpenSettings },
  ]

  const getScale = (i: number) => {
    if (hoveredIdx === null) return 1
    const dist = Math.abs(i - hoveredIdx)
    if (dist === 0) return 1.4
    if (dist === 1) return 1.2
    if (dist === 2) return 1.05
    return 1
  }

  return (
    <div style={{
      position: 'relative',
      height: 68,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: 8,
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        background: 'var(--bg-dock)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border-light)',
        borderRadius: 16,
        padding: '8px 14px',
        boxShadow: 'var(--shadow-dock)',
      }}>
        {items.map((item, i) => {
          const scale = getScale(i)
          return (
            <div key={item.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Tooltip */}
              {hoveredIdx === i && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  marginBottom: 6,
                  background: 'rgba(0,0,0,0.75)',
                  color: '#fff',
                  fontSize: 11,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  padding: '3px 8px',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}>
                  {item.label}
                </div>
              )}
              <button
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: 'var(--bg-window)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s',
                  transform: `scale(${scale}) translateY(${hoveredIdx === i ? -4 : 0}px)`,
                  boxShadow: hoveredIdx === i ? '0 4px 16px rgba(0,0,0,0.15)' : 'none',
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => {
                  if (item.action) item.action()
                  else if (item.href) window.open(item.href, '_blank')
                }}
                title={item.label}
              >
                {item.icon}
              </button>
              {/* Active dot */}
              <div style={{
                width: 3, height: 3, borderRadius: '50%',
                background: 'var(--blue-primary)',
                marginTop: 2,
                opacity: item.id === 'terminal' || item.id === 'projects' ? 1 : 0,
              }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
