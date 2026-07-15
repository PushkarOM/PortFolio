import { useState, useEffect } from 'react'
import BootScreen from './components/BootScreen'
import TopBar from './components/TopBar'
import DesktopIcons from './components/DesktopIcons'
import HeroWindow from './components/HeroWindow'
import TerminalWindow from './components/TerminalWindow'
import SideWidgets from './components/SideWidgets'
import BottomDock from './components/BottomDock'
import ProjectsWindow from './components/ProjectsWindow'

type Theme = 'aurora' | 'midnight' | 'retro' | 'matrix'
type Section = 'Home' | 'Projects' | 'Experience' | 'Skills' | 'Contact'

interface FloatingWindow {
  id: string
  title: string
  type: 'projects' | 'experience' | 'skills' | 'contact' | 'resume'
}

export default function App() {
  const [bootDone, setBootDone] = useState(false)
  const [theme, setTheme] = useState<Theme>('aurora')
  const [activeSection, setActiveSection] = useState<Section>('Home')
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [floatingWindows, setFloatingWindows] = useState<FloatingWindow[]>([])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'aurora' ? '' : theme)
  }, [theme])

  const openWindow = (id: string) => {
    if (id === 'Terminal') {
      setTerminalOpen(true)
      return
    }
    if (id === 'Projects') {
      setActiveSection('Projects')
      if (!floatingWindows.find(w => w.id === 'projects')) {
        setFloatingWindows(prev => [...prev, { id: 'projects', title: 'C:\\Projects', type: 'projects' }])
      }
      return
    }
    if (id === 'Contact') {
      setActiveSection('Contact')
      return
    }
    if (id === 'Experience') {
      setActiveSection('Experience')
      return
    }
    if (id === 'Skills') {
      setActiveSection('Skills')
      return
    }
  }

  const closeWindow = (id: string) => {
    setFloatingWindows(prev => prev.filter(w => w.id !== id))
  }

  const handleThemeChange = (t: string) => {
    if (['aurora', 'midnight', 'retro', 'matrix'].includes(t)) {
      setTheme(t as Theme)
    }
  }

  const handleSectionChange = (s: string) => {
    setActiveSection(s as Section)
    if (s === 'Projects') {
      if (!floatingWindows.find(w => w.id === 'projects')) {
        setFloatingWindows(prev => [...prev, { id: 'projects', title: 'C:\\Projects', type: 'projects' }])
      }
    }
  }

  const projectsOpen = floatingWindows.some(w => w.id === 'projects')

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
          }}
        >
          {/* Top bar */}
          <TopBar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
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
            <DesktopIcons onOpen={openWindow} activeSection={activeSection} />

            {/* Divider */}
            <div style={{ width: 1, background: 'var(--border-light)', opacity: 0.4, flexShrink: 0 }} />

            {/* Center: Main content */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 10,
              overflow: 'hidden',
              minWidth: 0,
            }}>
              {/* Home section */}
              {activeSection === 'Home' && !projectsOpen && (
                <>
                  {/* Hero window */}
                  <div style={{ flex: terminalOpen ? '0 0 58%' : '1 1 auto', minHeight: 0 }}>
                    <HeroWindow
                      onOpenTerminal={() => setTerminalOpen(true)}
                      onOpenProjects={() => {
                        setFloatingWindows(prev =>
                          prev.find(w => w.id === 'projects')
                            ? prev
                            : [...prev, { id: 'projects', title: 'C:\\Projects', type: 'projects' }]
                        )
                      }}
                    />
                  </div>

                  {/* Terminal window */}
                  {terminalOpen && (
                    <div style={{ flex: '0 0 38%', minHeight: 0 }}>
                      <TerminalWindow
                        visible={terminalOpen}
                        onClose={() => setTerminalOpen(false)}
                        onThemeChange={handleThemeChange}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Projects section */}
              {(activeSection === 'Projects' || projectsOpen) && (
                <div style={{ flex: 1, minHeight: 0 }}>
                  <ProjectsWindow onClose={() => {
                    closeWindow('projects')
                    setActiveSection('Home')
                  }} />
                </div>
              )}

              {/* Experience section */}
              {activeSection === 'Experience' && (
                <ExperienceView />
              )}

              {/* Skills section */}
              {activeSection === 'Skills' && (
                <SkillsView />
              )}

              {/* Contact section */}
              {activeSection === 'Contact' && (
                <ContactView />
              )}
            </div>

            {/* Divider */}
            <div style={{ width: 1, background: 'var(--border-light)', opacity: 0.4, flexShrink: 0 }} />

            {/* Right: Widgets */}
            <SideWidgets />
          </div>

          {/* Bottom Dock */}
          <BottomDock
            onOpenTerminal={() => setTerminalOpen(t => !t)}
            onOpenProjects={() => handleSectionChange('Projects')}
            onOpenContact={() => handleSectionChange('Contact')}
          />
        </div>
      )}
    </>
  )
}

/* ────── Inline views ────── */

function ExperienceView() {
  const jobs = [
    {
      role: 'ML Engineer Intern',
      company: 'TechCorp AI Labs',
      period: 'Jun 2024 – Aug 2024',
      color: '#3B82F6',
      achievements: [
        'Built a RAG pipeline reducing response latency by 40%',
        'Deployed 3 ML models to production via FastAPI + Docker',
        'Improved model accuracy from 87% to 94% with fine-tuning',
      ],
      stack: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'AWS'],
    },
    {
      role: 'Full Stack Developer Intern',
      company: 'StartupXYZ',
      period: 'Dec 2023 – Feb 2024',
      color: '#8B5CF6',
      achievements: [
        'Developed 12 REST API endpoints serving 5K+ daily users',
        'Reduced page load time by 35% through Next.js optimizations',
        'Implemented real-time features using WebSockets',
      ],
      stack: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
    },
  ]

  return (
    <div className="window window-open" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="window-title-bar" style={{ cursor: 'default' }}>
        <div className="window-dot red" />
        <div className="window-dot yellow" />
        <div className="window-dot green" />
        <span className="window-title">C:\Experience\timeline.md</span>
      </div>
      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0', letterSpacing: '-0.03em' }}>
          Work Experience
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {jobs.map((job, i) => (
            <div key={i} style={{
              background: 'var(--bg-window-alt)',
              border: `1px solid ${job.color}30`,
              borderLeft: `3px solid ${job.color}`,
              borderRadius: 8, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>{job.role}</div>
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-body)', color: job.color, fontWeight: 500 }}>{job.company}</div>
                </div>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-window)', border: '1px solid var(--border-light)', borderRadius: 4, padding: '2px 8px' }}>{job.period}</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginBottom: 10 }}>
                {job.achievements.map((a, j) => (
                  <li key={j} style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'flex-start' }}>
                    <span style={{ color: job.color, fontSize: 10, marginTop: 2 }}>▸</span>
                    <span style={{ fontSize: 11.5, fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {job.stack.map(s => (
                  <span key={s} style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', background: `${job.color}15`, color: job.color, border: `1px solid ${job.color}30`, borderRadius: 4, padding: '2px 7px' }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SkillsView() {
  const categories = [
    {
      name: 'Languages',
      color: '#3B82F6',
      skills: [
        { name: 'Python', level: 95 },
        { name: 'TypeScript', level: 82 },
        { name: 'C++', level: 70 },
        { name: 'Rust', level: 30 },
      ],
    },
    {
      name: 'ML / DL',
      color: '#8B5CF6',
      skills: [
        { name: 'PyTorch', level: 90 },
        { name: 'TensorFlow', level: 78 },
        { name: 'Scikit-Learn', level: 88 },
        { name: 'HuggingFace', level: 75 },
      ],
    },
    {
      name: 'Frontend',
      color: '#22D3EE',
      skills: [
        { name: 'React', level: 85 },
        { name: 'Next.js', level: 78 },
        { name: 'Tailwind', level: 88 },
      ],
    },
    {
      name: 'Backend',
      color: '#34D399',
      skills: [
        { name: 'FastAPI', level: 88 },
        { name: 'Node.js', level: 78 },
        { name: 'PostgreSQL', level: 80 },
        { name: 'Redis', level: 72 },
      ],
    },
    {
      name: 'DevOps / Cloud',
      color: '#F59E0B',
      skills: [
        { name: 'Docker', level: 84 },
        { name: 'AWS', level: 72 },
        { name: 'Git', level: 92 },
        { name: 'Linux', level: 85 },
      ],
    },
  ]

  const blockBar = (pct: number, color: string) => {
    const blocks = 10
    const filled = Math.round((pct / 100) * blocks)
    return Array.from({ length: blocks }).map((_, i) => (
      <span key={i} style={{ color: i < filled ? color : 'var(--border-window)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>█</span>
    ))
  }

  return (
    <div className="window window-open" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="window-title-bar" style={{ cursor: 'default' }}>
        <div className="window-dot red" />
        <div className="window-dot yellow" />
        <div className="window-dot green" />
        <span className="window-title">C:\Skills\stack.sh</span>
      </div>
      <div style={{ flex: 1, padding: '14px 16px', overflowY: 'auto', background: 'var(--bg-terminal)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {categories.map(cat => (
            <div key={cat.name} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${cat.color}25`,
              borderRadius: 7, padding: '12px 14px',
            }}>
              <div style={{
                fontSize: 11, fontFamily: 'var(--font-mono)', color: cat.color,
                fontWeight: 600, marginBottom: 10, letterSpacing: '0.04em',
              }}>
                # {cat.name}
              </div>
              {cat.skills.map(skill => (
                <div key={skill.name} style={{ marginBottom: 8 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-terminal)', marginBottom: 2 }}>
                    {'> '}{skill.name.toLowerCase()} --level
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 1 }}>{blockBar(skill.level, cat.color)}</div>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-terminal-dim)' }}>{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ContactView() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-window-alt)',
    border: '1px solid var(--border-light)',
    borderRadius: 6,
    padding: '8px 11px',
    fontSize: 12,
    fontFamily: 'var(--font-body)',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  const links = [
    { label: 'GitHub', icon: '⌨️', value: 'github.com/pushkar', color: '#E2E8F0' },
    { label: 'LinkedIn', icon: '💼', value: 'linkedin.com/in/pushkar', color: '#0A66C2' },
    { label: 'Email', icon: '📬', value: 'pushkar@email.com', color: '#34D399' },
    { label: 'Twitter', icon: '🐦', value: '@pushkar_dev', color: '#1DA1F2' },
  ]

  return (
    <div className="window window-open" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="window-title-bar" style={{ cursor: 'default' }}>
        <div className="window-dot red" />
        <div className="window-dot yellow" />
        <div className="window-dot green" />
        <span className="window-title">C:\Contact\compose_message.exe</span>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 260px', minHeight: 0 }}>
        {/* Compose */}
        <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.03em' }}>
            Send a Message
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: '0 0 20px 0' }}>
            Let's build something great together.
          </p>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Message sent!</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>I'll reply within 24 hours.</div>
              <button onClick={() => setSent(false)} style={{ marginTop: 16, background: 'var(--blue-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>
                Send Another
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Name</label>
                  <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Email</label>
                  <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Message</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 100, resize: 'vertical' } as React.CSSProperties}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>
              <button
                onClick={() => { if (name && email && message) setSent(true) }}
                style={{
                  background: 'var(--blue-primary)', color: '#fff',
                  border: 'none', borderRadius: 7, padding: '10px 20px',
                  fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600,
                  cursor: 'pointer', alignSelf: 'flex-start',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--blue-bright)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--blue-primary)')}
              >
                Send Message →
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ borderLeft: '1px solid var(--border-light)', padding: '20px 16px', background: 'var(--bg-window-alt)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Find me on
          </div>
          {links.map(link => (
            <div key={link.label} style={{
              background: 'var(--bg-window)',
              border: '1px solid var(--border-light)',
              borderRadius: 7, padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}>
              <span style={{ fontSize: 18 }}>{link.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)' }}>{link.label}</div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{link.value}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 8, padding: '12px', background: 'var(--bg-window)', border: '1px solid var(--border-light)', borderRadius: 7 }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--mint)', marginBottom: 6 }}>● Available for</div>
            {['Full-time roles', 'Freelance projects', 'Research collaboration', 'Open source'].map(item => (
              <div key={item} style={{ fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color: 'var(--mint)', fontSize: 8 }}>▸</span>{item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
