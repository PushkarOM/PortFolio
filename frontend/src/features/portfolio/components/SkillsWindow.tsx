import { useState, useEffect } from 'react'
import { portfolioApi, SkillCategory } from '../../../shared/services/api'
import { getThemeColor } from '../../../shared/utils/colorUtils'

function AnimatedSkillRow({ skillName, level, color }: { skillName: string; level: number; color: string }) {
  const [filledCount, setFilledCount] = useState(0)
  const blocks = 10
  const targetFilled = Math.round((level / 100) * blocks)

  useEffect(() => {
    if (targetFilled <= 0) return
    let current = 0
    const stepDuration = Math.max(30, Math.floor(750 / targetFilled))
    const timer = setInterval(() => {
      current += 1
      setFilledCount(current)
      if (current >= targetFilled) {
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [targetFilled])

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-terminal)', marginBottom: 2 }}>
        {'> '}{skillName.toLowerCase()} --level
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 1 }}>
          {Array.from({ length: blocks }).map((_, i) => (
            <span key={i} style={{ color: i < filledCount ? color : 'var(--border-window)', fontFamily: 'var(--font-mono)', fontSize: 13, transition: 'color 0.15s ease' }}>█</span>
          ))}
        </div>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-terminal-dim)' }}>{level}%</span>
      </div>
    </div>
  )
}

export default function SkillsWindow() {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  return (
    <div style={{ flex: 1, padding: '14px 16px', overflowY: 'auto', background: 'var(--bg-terminal)', height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 140 : 220}px, 1fr))`, gap: 14 }}>
        {categories.map(cat => {
          const themeColor = getThemeColor(cat.color)
          return (
            <div key={cat.name} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid color-mix(in srgb, ${themeColor} 30%, transparent)`,
              borderRadius: 7, padding: '12px 14px',
            }}>
              <div style={{
                fontSize: 11, fontFamily: 'var(--font-mono)', color: themeColor,
                fontWeight: 600, marginBottom: 10, letterSpacing: '0.04em',
              }}>
                # {cat.name}
              </div>
              {cat.skills.map(skill => (
                <AnimatedSkillRow key={skill.name} skillName={skill.name} level={skill.level} color={themeColor} />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
