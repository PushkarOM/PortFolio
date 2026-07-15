import { useState, useEffect } from 'react'
import { portfolioApi, Project, Experience, SkillCategory } from '../services/api'

export default function StudioCMS() {
  const [activeTab, setActiveTab] = useState<'projects' | 'experience' | 'skills' | 'settings'>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<SkillCategory[]>([])
  const [statusText, setStatusText] = useState('')
  const [coffeeCount, setCoffeeCount] = useState(3)

  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')

  // Selected for edit
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

  // Load initial data
  const loadData = () => {
    setProjects(portfolioApi.getProjects())
    setExperiences(portfolioApi.getExperiences())
    setSkills(portfolioApi.getSkills())
    setStatusText(portfolioApi.getStatusText())
    setCoffeeCount(portfolioApi.getCoffeeCount())
  }

  useEffect(() => {
    loadData()
    // Listen for data updates from other places (like terminal)
    window.addEventListener('pushkaros-data-change', loadData)
    return () => window.removeEventListener('pushkaros-data-change', loadData)
  }, [])

  const triggerSaveIndicator = () => {
    setSaving(true)
    setSaveStatus('idle')
    setTimeout(() => {
      setSaving(false)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 1500)
    }, 400)
  }

  // Project handlers
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return

    portfolioApi.saveProject(editingProject)
    setEditingProject(null)
    triggerSaveIndicator()
    loadData()
  }

  const handleDeleteProject = (id: string) => {
    if (confirm('Delete project?')) {
      portfolioApi.deleteProject(id)
      triggerSaveIndicator()
      loadData()
    }
  }

  const handleStartNewProject = () => {
    setEditingProject({
      id: `proj_${Date.now()}`,
      name: '',
      description: '',
      stack: [],
      status: 'Active',
      stars: 0,
      color: '#3B82F6',
      emoji: '🚀',
      highlights: [],
    })
  }

  // Experience handlers
  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExperience) return

    portfolioApi.saveExperience(editingExperience)
    setEditingExperience(null)
    triggerSaveIndicator()
    loadData()
  }

  const handleDeleteExperience = (id: string) => {
    if (confirm('Delete experience?')) {
      portfolioApi.deleteExperience(id)
      triggerSaveIndicator()
      loadData()
    }
  }

  const handleStartNewExperience = () => {
    setEditingExperience({
      id: `exp_${Date.now()}`,
      role: '',
      company: '',
      period: '',
      color: '#8B5CF6',
      achievements: [],
      stack: [],
    })
  }

  // Settings handlers
  const handleSaveSettings = () => {
    portfolioApi.saveStatusText(statusText)
    portfolioApi.saveCoffeeCount(coffeeCount)
    triggerSaveIndicator()
    loadData()
  }

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0, background: 'var(--bg-window)' }}>
      {/* CMS Sidebar */}
      <div style={{
        width: 180,
        background: 'var(--bg-window-alt)',
        borderRight: '1px solid var(--border-light)',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 12,
          paddingLeft: 6,
        }}>
          Studio CMS
        </div>
        {[
          { id: 'projects', label: '📁 Projects' },
          { id: 'experience', label: '💼 Experience' },
          { id: 'skills', label: '⚡ Skills' },
          { id: 'settings', label: '⚙️ Settings' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any)
              setEditingProject(null)
              setEditingExperience(null)
            }}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === tab.id ? 'var(--blue-primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              fontSize: 12,
              fontFamily: 'var(--font-body)',
              fontWeight: activeTab === tab.id ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto', padding: 8, borderTop: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {saving ? (
              <span style={{ color: 'var(--amber)' }}>● Saving...</span>
            ) : saveStatus === 'saved' ? (
              <span style={{ color: 'var(--mint)' }}>✓ Saved</span>
            ) : (
              <span>● Ready</span>
            )}
          </div>
        </div>
      </div>

      {/* CMS Main Panel */}
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* TAB: Projects */}
        {activeTab === 'projects' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {!editingProject ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: 0 }}>Projects List</h2>
                  <button
                    onClick={handleStartNewProject}
                    style={{
                      background: 'var(--blue-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                    }}
                  >
                    + Add Project
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {projects.map(proj => (
                    <div key={proj.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-window-alt)',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border-light)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{proj.emoji}</span>
                        <div>
                          <div style={{ fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600 }}>{proj.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{proj.stack.join(', ')}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => setEditingProject(proj)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--border-window)',
                            borderRadius: 5,
                            padding: '3px 8px',
                            fontSize: 10,
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--red)',
                            borderRadius: 5,
                            padding: '3px 8px',
                            fontSize: 10,
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            color: 'var(--red)',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px 0' }}>
                  {editingProject.name ? `Edit: ${editingProject.name}` : 'New Project'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Project Name</label>
                    <input
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                      value={editingProject.name}
                      onChange={e => setEditingProject({ ...editingProject, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Emoji Icon</label>
                    <input
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                      value={editingProject.emoji}
                      onChange={e => setEditingProject({ ...editingProject, emoji: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Description</label>
                  <textarea
                    style={{ width: '100%', minHeight: 60, background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                    value={editingProject.description}
                    onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Status</label>
                    <select
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                      value={editingProject.status}
                      onChange={e => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    >
                      <option value="Production">Production</option>
                      <option value="Active">Active</option>
                      <option value="Research">Research</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Stars</label>
                    <input
                      type="number"
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                      value={editingProject.stars}
                      onChange={e => setEditingProject({ ...editingProject, stars: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Color (Hex)</label>
                    <input
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                      value={editingProject.color}
                      onChange={e => setEditingProject({ ...editingProject, color: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Tech Stack (comma separated)</label>
                    <input
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                      value={editingProject.stack.join(', ')}
                      onChange={e => setEditingProject({ ...editingProject, stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Highlights (one per line)</label>
                  <textarea
                    style={{ width: '100%', minHeight: 60, background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                    value={editingProject.highlights.join('\n')}
                    onChange={e => setEditingProject({ ...editingProject, highlights: e.target.value.split('\n').filter(Boolean) })}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button type="submit" style={{ background: 'var(--blue-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingProject(null)} style={{ background: 'transparent', border: '1px solid var(--border-window)', color: 'var(--text-secondary)', borderRadius: 6, padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB: Experience */}
        {activeTab === 'experience' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {!editingExperience ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: 0 }}>Work Experience</h2>
                  <button
                    onClick={handleStartNewExperience}
                    style={{
                      background: 'var(--blue-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                    }}
                  >
                    + Add Experience
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {experiences.map(exp => (
                    <div key={exp.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-window-alt)',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border-light)',
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600 }}>{exp.role}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{exp.company} | {exp.period}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => setEditingExperience(exp)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--border-window)',
                            borderRadius: 5,
                            padding: '3px 8px',
                            fontSize: 10,
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--red)',
                            borderRadius: 5,
                            padding: '3px 8px',
                            fontSize: 10,
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            color: 'var(--red)',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveExperience} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px 0' }}>
                  {editingExperience.role ? `Edit: ${editingExperience.role}` : 'New Experience'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Role Name</label>
                    <input
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                      value={editingExperience.role}
                      onChange={e => setEditingExperience({ ...editingExperience, role: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Company Name</label>
                    <input
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                      value={editingExperience.company}
                      onChange={e => setEditingExperience({ ...editingExperience, company: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Period (e.g. Jun 2024 - Aug 2024)</label>
                    <input
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                      value={editingExperience.period}
                      onChange={e => setEditingExperience({ ...editingExperience, period: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Tech Stack (comma separated)</label>
                    <input
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                      value={editingExperience.stack.join(', ')}
                      onChange={e => setEditingExperience({ ...editingExperience, stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Color (Hex)</label>
                  <input
                    style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                    value={editingExperience.color}
                    onChange={e => setEditingExperience({ ...editingExperience, color: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Achievements (one per line)</label>
                  <textarea
                    style={{ width: '100%', minHeight: 80, background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                    value={editingExperience.achievements.join('\n')}
                    onChange={e => setEditingExperience({ ...editingExperience, achievements: e.target.value.split('\n').filter(Boolean) })}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button type="submit" style={{ background: 'var(--blue-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingExperience(null)} style={{ background: 'transparent', border: '1px solid var(--border-window)', color: 'var(--text-secondary)', borderRadius: 6, padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB: Skills */}
        {activeTab === 'skills' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Skills Categories</h2>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>Skills are currently managed as static listings within categories. Edits are directly updated in standard listings.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {skills.map((cat, catIdx) => (
                <div key={cat.name} style={{
                  background: 'var(--bg-window-alt)',
                  border: '1px solid var(--border-light)',
                  padding: 14,
                  borderRadius: 8,
                }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {cat.skills.map((s, sIdx) => (
                      <div key={s.name} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'var(--bg-window)',
                        border: '1px solid var(--border-light)',
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontSize: 10.5,
                        fontFamily: 'var(--font-mono)',
                      }}>
                        <span>{s.name}</span>
                        <input
                          type="number"
                          style={{
                            width: 36,
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--border-light)',
                            textAlign: 'center',
                            fontSize: 9.5,
                            color: 'var(--blue-primary)',
                            outline: 'none',
                          }}
                          value={s.level}
                          onChange={e => {
                            const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                            const next = [...skills]
                            next[catIdx].skills[sIdx].level = val
                            setSkills(next)
                            portfolioApi.saveSkills(next)
                          }}
                        />
                        <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Settings */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: 0 }}>System Settings</h2>
            <div>
              <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Workspace Status (Side Widget)</label>
              <input
                style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)', fontSize: 12 }}
                value={statusText}
                onChange={e => setStatusText(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Coffee Count today</label>
              <input
                type="number"
                style={{ width: 80, background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)', fontSize: 12 }}
                value={coffeeCount}
                onChange={e => setCoffeeCount(parseInt(e.target.value) || 0)}
              />
            </div>
            <button
              onClick={handleSaveSettings}
              style={{
                background: 'var(--blue-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                alignSelf: 'flex-start',
                marginTop: 8,
              }}
            >
              Save Settings
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
