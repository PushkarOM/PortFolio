import { useState, useEffect, useRef, useCallback } from 'react'
import { portfolioApi, Project, Experience, SkillCategory, NowBuildingItem, LearningItem } from '../../../shared/services/api'

export default function StudioCMS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [activeTab, setActiveTab] = useState<'projects' | 'experience' | 'skills' | 'sidebar' | 'settings'>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<SkillCategory[]>([])
  const [nowBuilding, setNowBuilding] = useState<NowBuildingItem[]>([])
  const [learningLog, setLearningLog] = useState<LearningItem[]>([])
  const [statusText, setStatusText] = useState('')
  const [coffeeCount, setCoffeeCount] = useState(3)

  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')

  // Selected for edit
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

  // Local string buffers for Tech Stack inputs — lets users type commas and spaces
  // without the split/trim/filter onChange clobbering the field mid-keystroke.
  const [projectStackText, setProjectStackText] = useState('')
  const [experienceStackText, setExperienceStackText] = useState('')

  // Password change state
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  // Timer refs for triggerSaveIndicator cleanup (Issue E6)
  const saveTimer1Ref = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveTimer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Debounce ref for skills onChange (Issue F1)
  const skillsDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load initial data
  const loadData = async () => {
    try {
      const projs = await portfolioApi.getProjects()
      const exps = await portfolioApi.getExperiences()
      const skls = await portfolioApi.getSkills()
      const nowBuild = await portfolioApi.getNowBuilding()
      const learnLog = await portfolioApi.getLearningLog()
      const stat = await portfolioApi.getStatusText()
      const coffees = await portfolioApi.getCoffeeCount()

      setProjects(projs)
      setExperiences(exps)
      setSkills(skls)
      setNowBuilding(nowBuild)
      setLearningLog(learnLog)
      setStatusText(stat)
      setCoffeeCount(coffees)
    } catch (e) {
      console.error('Failed to load portfolio data:', e)
    }
  }

  useEffect(() => {
    const authState = portfolioApi.isAuthenticated()
    setIsAuthenticated(authState)
    if (authState) {
      loadData()
    }

    const handleAuthLogout = () => {
      setIsAuthenticated(false)
    }

    window.addEventListener('pushkaros-data-change', loadData)
    window.addEventListener('pushkaros-auth-logout', handleAuthLogout)
    return () => {
      window.removeEventListener('pushkaros-data-change', loadData)
      window.removeEventListener('pushkaros-auth-logout', handleAuthLogout)
      // Cleanup save indicator timers on unmount (Issue E6)
      if (saveTimer1Ref.current) clearTimeout(saveTimer1Ref.current)
      if (saveTimer2Ref.current) clearTimeout(saveTimer2Ref.current)
      if (skillsDebounceRef.current) clearTimeout(skillsDebounceRef.current)
    }
  }, [])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return
    setLoggingIn(true)
    setLoginError('')
    try {
      const success = await portfolioApi.login(password)
      if (success) {
        setIsAuthenticated(true)
        loadData()
      } else {
        setLoginError('Incorrect password.')
      }
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect password.')
    } finally {
      setLoggingIn(false)
    }
  }

  const handleLogout = () => {
    portfolioApi.logout()
    setIsAuthenticated(false)
    setPassword('')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !newPassword) {
      setPasswordMessage('Both fields are required.')
      return
    }
    try {
      const success = await portfolioApi.changePassword(oldPassword, newPassword)
      if (success) {
        setPasswordMessage('Password updated successfully!')
        setOldPassword('')
        setNewPassword('')
      } else {
        setPasswordMessage('Failed to update password.')
      }
    } catch (err: any) {
      setPasswordMessage(err.message || 'Failed to update password.')
    }
  }

  const triggerSaveIndicator = useCallback(() => {
    // Clear any in-flight timers before starting new ones (Issue E6)
    if (saveTimer1Ref.current) clearTimeout(saveTimer1Ref.current)
    if (saveTimer2Ref.current) clearTimeout(saveTimer2Ref.current)
    setSaving(true)
    setSaveStatus('idle')
    saveTimer1Ref.current = setTimeout(() => {
      setSaving(false)
      setSaveStatus('saved')
      saveTimer2Ref.current = setTimeout(() => setSaveStatus('idle'), 1500)
    }, 400)
  }, [])

  // Project handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    try {
      await portfolioApi.saveProject(editingProject)
      setEditingProject(null)
      triggerSaveIndicator()
      // No manual loadData() call needed — saveProject fires pushkaros-data-change
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (confirm('Delete project?')) {
      try {
        await portfolioApi.deleteProject(id)
        triggerSaveIndicator()
        // No manual loadData() call needed — deleteProject fires pushkaros-data-change
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleStartNewProject = () => {
    setProjectStackText('')
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
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExperience) return
    try {
      await portfolioApi.saveExperience(editingExperience)
      setEditingExperience(null)
      triggerSaveIndicator()
      // No manual loadData() call needed
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteExperience = async (id: string) => {
    if (confirm('Delete experience?')) {
      try {
        await portfolioApi.deleteExperience(id)
        triggerSaveIndicator()
        // No manual loadData() call needed
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleStartNewExperience = () => {
    setExperienceStackText('')
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
  const handleSaveSidebar = async () => {
    try {
      await portfolioApi.saveNowBuilding(nowBuilding)
      await portfolioApi.saveLearningLog(learningLog)
      triggerSaveIndicator()
      // No manual loadData() call needed
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveSettings = async () => {
    try {
      await portfolioApi.saveStatusText(statusText)
      // coffeeCount is managed atomically via /coffee-count — no pass-through needed
      triggerSaveIndicator()
      // No manual loadData() call needed
    } catch (err) {
      console.error(err)
    }
  }

  // LOCK SCREEN RENDER
  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 24,
        background: 'var(--bg-terminal)',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-terminal)',
      }}>
        <form onSubmit={handleLoginSubmit} style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-window)',
          borderRadius: 12,
          padding: '30px 24px',
          width: '100%',
          maxWidth: 360,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontSize: 32, marginBottom: 4 }} className="float-a">🔒</div>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}>
            PushkarOS Studio CMS
          </div>
          <div style={{
            fontSize: 10,
            color: 'var(--text-terminal-dim)',
            textAlign: 'center',
            lineHeight: 1.4,
            marginTop: -8,
          }}>
            Please enter your administrator password to customize projects and settings.
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            <label style={{ fontSize: 9, color: 'var(--text-terminal-dim)', textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loggingIn}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-light)',
                borderRadius: 6,
                padding: '10px 12px',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-terminal)',
                outline: 'none',
                textAlign: 'center',
              }}
              autoFocus
            />
          </div>

          {loginError && (
            <div style={{
              fontSize: 11,
              color: 'var(--red)',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
            }}>
              ✗ {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loggingIn || !password}
            style={{
              width: '100%',
              background: 'var(--blue-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 16px',
              fontSize: 12,
              fontWeight: 600,
              cursor: loggingIn || !password ? 'default' : 'pointer',
              transition: 'background 0.15s',
              marginTop: 4,
            }}
            onMouseEnter={e => { if (!loggingIn && password) e.currentTarget.style.background = 'var(--blue-bright)' }}
            onMouseLeave={e => { if (!loggingIn && password) e.currentTarget.style.background = 'var(--blue-primary)' }}
          >
            {loggingIn ? 'Unlocking...' : 'Unlock CMS'}
          </button>
        </form>
      </div>
    )
  }

  // AUTHENTICATED CMS RENDER
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
          { id: 'sidebar', label: '🪟 Sidebar' },
          { id: 'settings', label: '⚙️ Settings' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any)
              setEditingProject(null)
              setEditingExperience(null)
              setPasswordMessage('')
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
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 8 }}>
            {saving ? (
              <span style={{ color: 'var(--amber)' }}>● Saving...</span>
            ) : saveStatus === 'saved' ? (
              <span style={{ color: 'var(--mint)' }}>✓ Saved</span>
            ) : (
              <span>● Ready</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              textAlign: 'center',
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid var(--border-light)',
              background: 'transparent',
              color: 'var(--red)',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Logout
          </button>
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
                          onClick={() => { setProjectStackText(proj.stack.join(', ')); setEditingProject(proj) }}
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
                      value={projectStackText}
                      onChange={e => {
                        setProjectStackText(e.target.value)
                        const parsed = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        setEditingProject(prev => prev ? { ...prev, stack: parsed } : null)
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>GitHub URL</label>
                    <input
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                      value={editingProject.githubUrl || ''}
                      onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Live/Demo URL</label>
                    <input
                      style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)' }}
                      value={editingProject.liveUrl || ''}
                      onChange={e => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
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
                          onClick={() => { setExperienceStackText(exp.stack.join(', ')); setEditingExperience(exp) }}
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
                      value={experienceStackText}
                      onChange={e => {
                        setExperienceStackText(e.target.value)
                        const parsed = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        setEditingExperience(prev => prev ? { ...prev, stack: parsed } : null)
                      }}
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
                            // Deep-copy so React detects the state change (Issue F1)
                            const next = skills.map(c => ({
                              ...c,
                              skills: c.skills.map(sk => ({ ...sk }))
                            }))
                            next[catIdx].skills[sIdx].level = val
                            setSkills(next)
                            // Debounce the API save to avoid hammering on every keystroke (Issue F1)
                            if (skillsDebounceRef.current) clearTimeout(skillsDebounceRef.current)
                            skillsDebounceRef.current = setTimeout(() => {
                              portfolioApi.saveSkills(next).catch(console.error)
                            }, 500)
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

        {/* TAB: Sidebar */}
        {activeTab === 'sidebar' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', paddingRight: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: 0 }}>Sidebar Widgets</h2>
            
            {/* Now Building */}
            <div style={{ background: 'var(--bg-window-alt)', padding: 16, borderRadius: 8, border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: 14, fontFamily: 'var(--font-mono)', margin: '0 0 12px 0' }}>Now Building</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {nowBuilding.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <input
                      style={{ width: 80, background: 'var(--bg-window)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 8px', color: 'var(--text-primary)', fontSize: 11 }}
                      value={item.dot}
                      onChange={e => {
                        const next = [...nowBuilding]
                        next[i].dot = e.target.value
                        setNowBuilding(next)
                      }}
                      placeholder="Color (Hex)"
                    />
                    <input
                      style={{ flex: 1, background: 'var(--bg-window)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 8px', color: 'var(--text-primary)', fontSize: 11 }}
                      value={item.text}
                      onChange={e => {
                        const next = [...nowBuilding]
                        next[i].text = e.target.value
                        setNowBuilding(next)
                      }}
                      placeholder="Text"
                    />
                    <button
                      onClick={() => setNowBuilding(nowBuilding.filter((_, idx) => idx !== i))}
                      style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, padding: '0 10px', fontSize: 10, cursor: 'pointer' }}
                    >X</button>
                  </div>
                ))}
                <button
                  onClick={() => setNowBuilding([...nowBuilding, { id: `nb_${Date.now()}`, text: 'New item', dot: '#3B82F6' }])}
                  style={{ background: 'var(--bg-window)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', borderRadius: 6, padding: '6px 0', fontSize: 11, cursor: 'pointer' }}
                >+ Add Item</button>
              </div>
            </div>

            {/* Learning Log */}
            <div style={{ background: 'var(--bg-window-alt)', padding: 16, borderRadius: 8, border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: 14, fontFamily: 'var(--font-mono)', margin: '0 0 12px 0' }}>Learning Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {learningLog.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <input
                      style={{ flex: 1, background: 'var(--bg-window)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 8px', color: 'var(--text-primary)', fontSize: 11 }}
                      value={item.name}
                      onChange={e => {
                        const next = [...learningLog]
                        next[i].name = e.target.value
                        setLearningLog(next)
                      }}
                      placeholder="Topic"
                    />
                    <input
                      type="number"
                      style={{ width: 60, background: 'var(--bg-window)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 8px', color: 'var(--text-primary)', fontSize: 11 }}
                      value={item.pct}
                      onChange={e => {
                        const next = [...learningLog]
                        next[i].pct = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                        setLearningLog(next)
                      }}
                      placeholder="%"
                    />
                    <input
                      style={{ width: 80, background: 'var(--bg-window)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 8px', color: 'var(--text-primary)', fontSize: 11 }}
                      value={item.color}
                      onChange={e => {
                        const next = [...learningLog]
                        next[i].color = e.target.value
                        setLearningLog(next)
                      }}
                      placeholder="Color"
                    />
                    <button
                      onClick={() => setLearningLog(learningLog.filter((_, idx) => idx !== i))}
                      style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, padding: '0 10px', fontSize: 10, cursor: 'pointer' }}
                    >X</button>
                  </div>
                ))}
                <button
                  onClick={() => setLearningLog([...learningLog, { id: `learn_${Date.now()}`, name: 'New topic', pct: 0, color: '#8B5CF6' }])}
                  style={{ background: 'var(--bg-window)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', borderRadius: 6, padding: '6px 0', fontSize: 11, cursor: 'pointer' }}
                >+ Add Topic</button>
              </div>
            </div>

            <button
              onClick={handleSaveSidebar}
              style={{
                background: 'var(--blue-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px',
                fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer', alignSelf: 'flex-start'
              }}
            >
              Save Sidebar Widgets
            </button>
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
                marginBottom: 20,
              }}
            >
              Save Settings
            </button>

            {/* Change Password Admin Section */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, marginTop: 10 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>Change CMS Password</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Old Password</label>
                  <input
                    type="password"
                    style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)', fontSize: 12 }}
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>New Password</label>
                  <input
                    type="password"
                    style={{ width: '100%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 6, padding: 8, color: 'var(--text-primary)', fontSize: 12 }}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {passwordMessage && (
                <div style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: passwordMessage.includes('successfully') ? 'var(--mint)' : 'var(--red)',
                  marginBottom: 10,
                }}>
                  {passwordMessage}
                </div>
              )}
              <button
                onClick={handleChangePassword}
                style={{
                  background: 'var(--blue-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
