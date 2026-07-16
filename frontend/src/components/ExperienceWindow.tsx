import { useState, useEffect } from 'react'
import { portfolioApi, Experience } from '../services/api'

export default function ExperienceWindow() {
  const [jobs, setJobs] = useState<Experience[]>([])

  const loadExperiences = async () => {
    try {
      const data = await portfolioApi.getExperiences()
      setJobs(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadExperiences()
    window.addEventListener('pushkaros-data-change', loadExperiences)
    return () => window.removeEventListener('pushkaros-data-change', loadExperiences)
  }, [])

  return (
    <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', background: 'var(--bg-window)', height: '100%' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0', letterSpacing: '-0.03em' }}>
        Work Experience
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {jobs.map((job, i) => (
          <div key={job.id || i} style={{
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
  )
}
