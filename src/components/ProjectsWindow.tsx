import { useState, useEffect } from 'react'
import { portfolioApi, Project } from '../services/api'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Production: { bg: 'rgba(52,211,153,0.15)', text: '#34D399' },
  Active: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  Research: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  Complete: { bg: 'rgba(148,163,184,0.15)', text: '#94A3B8' },
}

interface Props {
  onClose: () => void
}

export default function ProjectsWindow({ onClose }: Props) {
  const [projects, setProjects] = useState<Project[]>([])
  const [selected, setSelected] = useState<Project | null>(null)
  const [filter, setFilter] = useState<string>('All')

  const loadProjects = () => {
    setProjects(portfolioApi.getProjects())
  }

  useEffect(() => {
    loadProjects()
    window.addEventListener('pushkaros-data-change', loadProjects)
    return () => window.removeEventListener('pushkaros-data-change', loadProjects)
  }, [])

  const filters = ['All', 'Active', 'Production', 'Research', 'Complete']
  const filtered = filter === 'All' ? projects : projects.filter(p => p.status === filter)

  return (
    <div className="window" style={{
      display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      {/* Title bar */}
      <div className="window-title-bar" style={{ cursor: 'default' }}>
        <div className="window-dot red" onClick={onClose} title="Close" />
        <div className="window-dot yellow" />
        <div className="window-dot green" />
        <span className="window-title">C:\Projects — {PROJECTS.length} items</span>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--bg-window)',
      }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginRight: 4 }}>Filter:</span>
        {filters.map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'var(--blue-primary)' : 'transparent',
              color: filter === f ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${filter === f ? 'var(--blue-primary)' : 'var(--border-light)'}`,
              borderRadius: 5, padding: '2px 9px',
              fontSize: 10, fontFamily: 'var(--font-mono)', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >{f}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Project grid */}
        <div style={{
          flex: 1, padding: 12, overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: selected ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 10,
          alignContent: 'start',
        }}>
          {filtered.map(project => (
            <div
              key={project.id}
              onClick={() => setSelected(selected?.id === project.id ? null : project)}
              style={{
                background: selected?.id === project.id ? `${project.color}15` : 'var(--bg-window)',
                border: `1px solid ${selected?.id === project.id ? project.color + '40' : 'var(--border-light)'}`,
                borderRadius: 8, padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (selected?.id !== project.id)
                  (e.currentTarget as HTMLDivElement).style.borderColor = project.color + '40'
              }}
              onMouseLeave={e => {
                if (selected?.id !== project.id)
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{project.emoji}</span>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {project.name}
                  </span>
                </div>
                <span style={{
                  fontSize: 9, fontFamily: 'var(--font-mono)',
                  background: STATUS_COLORS[project.status].bg,
                  color: STATUS_COLORS[project.status].text,
                  padding: '2px 6px', borderRadius: 4,
                }}>{project.status}</span>
              </div>

              <p style={{
                fontSize: 11, fontFamily: 'var(--font-body)',
                color: 'var(--text-secondary)', lineHeight: 1.5,
                margin: '0 0 8px 0',
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{project.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                {project.stack.slice(0, 3).map(t => (
                  <span key={t} style={{
                    fontSize: 9, fontFamily: 'var(--font-mono)',
                    background: 'var(--bg-window-alt)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 3, padding: '1px 5px',
                    color: 'var(--text-muted)',
                  }}>{t}</span>
                ))}
                {project.stack.length > 3 && (
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>+{project.stack.length - 3}</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 11 }}>⭐</span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{project.stars}</span>
                </div>
                <div style={{ display: 'flex', gap: 1 }}>
                  {[0.9, 0.7, 0.5, 0.3].map((o, i) => (
                    <div key={i} style={{ width: 3, height: 8 + i * 2, background: project.color, opacity: o, borderRadius: 1 }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{
            width: 280, borderLeft: '1px solid var(--border-light)',
            padding: 16, overflowY: 'auto', background: 'var(--bg-window)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{selected.emoji}</span>
              <div>
                <div style={{ fontSize: 15, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>{selected.name}</div>
                <span style={{
                  fontSize: 9, fontFamily: 'var(--font-mono)',
                  background: STATUS_COLORS[selected.status].bg,
                  color: STATUS_COLORS[selected.status].text,
                  padding: '2px 7px', borderRadius: 4,
                }}>{selected.status}</span>
              </div>
            </div>

            <p style={{ fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
              {selected.description}
            </p>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Highlights</div>
              {selected.highlights.map(h => (
                <div key={h} style={{ display: 'flex', gap: 7, marginBottom: 5, alignItems: 'center' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: selected.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{h}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Tech Stack</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {selected.stack.map(t => (
                  <span key={t} style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                    background: `${selected.color}15`,
                    border: `1px solid ${selected.color}30`,
                    color: selected.color,
                    borderRadius: 4, padding: '3px 7px',
                  }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  if (selected.githubUrl) {
                    window.open(selected.githubUrl, '_blank')
                  } else {
                    alert('No GitHub repository provided for this project.')
                  }
                }}
                style={{
                  flex: 1, background: selected.color, border: 'none',
                  color: '#fff', borderRadius: 6, padding: '7px 0',
                  fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, cursor: 'pointer',
                  opacity: selected.githubUrl ? 1 : 0.5,
                }}
              >
                GitHub →
              </button>
              <button
                onClick={() => {
                  if (selected.liveUrl) {
                    window.open(selected.liveUrl, '_blank')
                  } else {
                    alert('No live demo available for this project.')
                  }
                }}
                style={{
                  flex: 1, background: 'transparent', border: `1px solid var(--border-light)`,
                  color: 'var(--text-secondary)', borderRadius: 6, padding: '7px 0',
                  fontSize: 11, fontFamily: 'var(--font-mono)', cursor: 'pointer',
                  opacity: selected.liveUrl ? 1 : 0.5,
                }}
              >
                Live Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
