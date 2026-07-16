import { useState, useEffect } from 'react'

type Theme = 'aurora' | 'midnight' | 'retro' | 'matrix'

interface Props {
  activeSection: string
  onSectionChange: (s: string) => void
  theme: Theme
  onThemeChange: (t: Theme) => void
}

const NAV_ITEMS = ['Home', 'Projects', 'Experience', 'Skills', 'Contact']
const THEMES: { id: Theme; label: string; dot: string }[] = [
  { id: 'aurora', label: 'Aurora', dot: '#3B82F6' },
  { id: 'midnight', label: 'Midnight', dot: '#8B5CF6' },
  { id: 'retro', label: 'RetroOS', dot: '#F59E0B' },
  { id: 'matrix', label: 'Matrix', dot: '#34D399' },
]

function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const fmt = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  const day = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-topbar)', lineHeight: 1.2 }}>{fmt}</div>
      <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)', lineHeight: 1.2 }}>{day}</div>
    </div>
  )
}

export default function TopBar({ activeSection, onSectionChange, theme, onThemeChange }: Props) {
  const [themeOpen, setThemeOpen] = useState(false)

  return (
    <div style={{
      background: 'var(--bg-topbar)',
      height: 36,
      display: 'flex',
      alignItems: 'center',
      paddingInline: 14,
      gap: 0,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginRight: 20, cursor: 'pointer' }}
        onClick={() => onSectionChange('Home')}>
        <div style={{
          width: 20, height: 20, borderRadius: 5,
          background: 'linear-gradient(135deg, #2563EB, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: '#fff',
          fontFamily: 'var(--font-display)',
        }}>P</div>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
          color: 'var(--text-topbar)', letterSpacing: '-0.01em',
        }}>PushkarOS</span>
      </div>

      {/* Workspace divider */}
      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', marginRight: 16 }} />

      {/* Navigation */}
      <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item}
            onClick={() => onSectionChange(item)}
            style={{
              background: activeSection === item
                ? 'rgba(37, 99, 235, 0.25)'
                : 'transparent',
              border: 'none',
              color: activeSection === item ? '#60A5FA' : 'rgba(148,163,184,0.7)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: activeSection === item ? 500 : 400,
              padding: '3px 10px',
              borderRadius: 5,
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
            onMouseEnter={e => {
              if (activeSection !== item)
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'
            }}
            onMouseLeave={e => {
              if (activeSection !== item)
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }}
          >
            {activeSection === item && (
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3B82F6', display: 'inline-block' }} />
            )}
            {item}
          </button>
        ))}
      </nav>

      {/* System tray */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* WiFi */}
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
          <path d="M7 9.5C7.55 9.5 8 9.95 8 10.5S7.55 11.5 7 11.5 6 11.05 6 10.5 6.45 9.5 7 9.5Z" fill="rgba(148,163,184,0.6)"/>
          <path d="M4 7.5C4.9 6.6 6 6 7 6s2.1.6 3 1.5" stroke="rgba(148,163,184,0.6)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M1.5 5C3.1 3.4 5 2.5 7 2.5s3.9.9 5.5 2.5" stroke="rgba(148,163,184,0.4)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </svg>

        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 20, height: 10, border: '1.2px solid rgba(148,163,184,0.5)', borderRadius: 2, position: 'relative', display: 'flex', alignItems: 'center', padding: '1px' }}>
            <div style={{ width: '80%', height: '100%', background: '#34D399', borderRadius: 1 }} />
            <div style={{ position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)', width: 2, height: 5, background: 'rgba(148,163,184,0.5)', borderRadius: '0 1px 1px 0' }} />
          </div>
          <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)', fontFamily: 'var(--font-mono)' }}>80%</span>
        </div>

        {/* Theme toggle */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setThemeOpen(o => !o)}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 5,
              color: 'rgba(148,163,184,0.8)',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: THEMES.find(t => t.id === theme)?.dot ?? '#3B82F6', display: 'inline-block' }} />
            {THEMES.find(t => t.id === theme)?.label}
            <span style={{ opacity: 0.5 }}>▾</span>
          </button>

          {themeOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 4,
              background: '#1E2333',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              zIndex: 999,
              minWidth: 130,
            }}>
              {THEMES.map(t => (
                <button key={t.id}
                  onClick={() => { onThemeChange(t.id); setThemeOpen(false) }}
                  style={{
                    width: '100%', textAlign: 'left', background: theme === t.id ? 'rgba(37,99,235,0.2)' : 'transparent',
                    border: 'none', color: theme === t.id ? '#60A5FA' : 'rgba(148,163,184,0.8)',
                    fontSize: 11, fontFamily: 'var(--font-mono)', padding: '7px 12px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseEnter={e => { if (theme !== t.id) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={e => { if (theme !== t.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.dot }} />
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Clock />
      </div>
    </div>
  )
}
