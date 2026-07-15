import { useState, useEffect } from 'react'
import DeveloperIllustration from './DeveloperIllustration'

interface Props {
  onOpenTerminal: () => void
  onOpenProjects: () => void
}

const ROLES = ['AI Engineer', 'ML Researcher', 'Backend Developer', 'Problem Solver']

export default function HeroWindow({ onOpenTerminal, onOpenProjects }: Props) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const role = ROLES[roleIndex]
    if (typing) {
      if (displayed.length < role.length) {
        const t = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 70)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1600)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
        return () => clearTimeout(t)
      } else {
        setRoleIndex(i => (i + 1) % ROLES.length)
        setTyping(true)
      }
    }
  }, [displayed, typing, roleIndex])

  return (
    <div className="window window-open" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Title bar */}
      <div className="window-title-bar" style={{ cursor: 'default' }}>
        <div className="window-dot red" />
        <div className="window-dot yellow" />
        <div className="window-dot green" />
        <span className="window-title">C:\PUSHKAR\about_me.exe</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.4 }}>
          <rect x="1" y="1" width="10" height="10" rx="2" stroke="white" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 0,
        overflow: 'hidden',
      }}>
        {/* Left — illustration */}
        <div style={{
          background: 'var(--bg-window-alt)',
          borderRight: '1px solid var(--border-light)',
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0,
        }}>
          {/* Grid dot bg */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.08) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
          <DeveloperIllustration />
        </div>

        {/* Right — intro */}
        <div style={{
          padding: '24px 22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 0,
          overflowY: 'auto',
        }}>
          {/* Greeting */}
          <div style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--blue-primary)',
            marginBottom: 6,
            letterSpacing: '0.08em',
          }}>
            {'> ./greet --user=visitor'}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 4px 0',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}>
            Hi, I'm Pushkar
          </h1>

          {/* Typing role */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(12px, 1.6vw, 15px)',
            color: 'var(--blue-primary)',
            marginBottom: 14,
            minHeight: 22,
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            <span>{displayed}</span>
            <span className="cursor-blink" style={{ color: 'var(--blue-primary)', fontWeight: 300 }}>|</span>
          </div>

          {/* Bio */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12.5,
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            margin: '0 0 18px 0',
          }}>
            I build intelligent systems that solve real-world problems using code, data, and creativity.
          </p>

          {/* Tech badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 18 }}>
            {['Python', 'PyTorch', 'React', 'FastAPI', 'Docker', 'AWS'].map(tech => (
              <span key={tech} style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                background: 'var(--bg-window-alt)',
                border: '1px solid var(--border-light)',
                borderRadius: 4,
                padding: '2px 7px',
              }}>{tech}</span>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={onOpenProjects}
              style={{
                background: 'var(--blue-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                padding: '8px 16px',
                fontSize: 12,
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--blue-bright)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--blue-primary)')}
            >
              View Projects →
            </button>
            <button
              onClick={onOpenTerminal}
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-window)',
                borderRadius: 7,
                padding: '8px 16px',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget.style.background = 'var(--bg-window-alt)') }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'transparent') }}
            >
              {'> terminal'}
            </button>
          </div>

          {/* Status bar */}
          <div style={{
            marginTop: 20,
            paddingTop: 14,
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
          }}>
            {[
              { label: 'Location', value: '📍 India' },
              { label: 'Status', value: '🟢 Open to Work' },
              { label: 'Focus', value: '🤖 AI/ML + FullStack' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
