import { useState, useEffect } from 'react'
import { portfolioApi, SkillCategory } from '../services/api'

export default function SkillsWindow() {
  const [categories, setCategories] = useState<SkillCategory[]>([])

  const loadSkills = async () => {
    try {
      const data = await portfolioApi.getSkills()
      setCategories(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadSkills()
    window.addEventListener('pushkaros-data-change', loadSkills)
    return () => window.removeEventListener('pushkaros-data-change', loadSkills)
  }, [])

  const blockBar = (pct: number, color: string) => {
    const blocks = 10
    const filled = Math.round((pct / 100) * blocks)
    return Array.from({ length: blocks }).map((_, i) => (
      <span key={i} style={{ color: i < filled ? color : 'var(--border-window)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>█</span>
    ))
  }

  return (
    <div style={{ flex: 1, padding: '14px 16px', overflowY: 'auto', background: 'var(--bg-terminal)', height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
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
  )
}
