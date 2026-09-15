import { useState, useEffect, useRef } from 'react'
import { portfolioApi, NowBuildingItem, LearningItem } from '../../../shared/services/api'
import { getThemeColor } from '../../../shared/utils/colorUtils'

function WidgetShell({ title, children, accent = '#3B82F6', className, style }: {
  title: string
  children: React.ReactNode
  accent?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={`window widget-slide-in ${className || ''}`} style={{ overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{
        background: 'var(--bg-topbar)',
        padding: '6px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(148,163,184,0.7)', flex: 1 }}>{title}</span>
      </div>
      <div style={{ padding: '14px 16px', background: 'var(--bg-window)' }}>
        {children}
      </div>
    </div>
  )
}

function Neofetch() {
  const [uptime, setUptime] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setUptime(u => u + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const fmtUptime = () => {
    const h = Math.floor(uptime / 3600)
    const m = Math.floor((uptime % 3600) / 60)
    const s = uptime % 60
    return `${h}h ${m}m ${s}s`
  }

  const rows = [
    { key: 'OS', val: 'PushkarOS 3.1.4' },
    { key: 'Host', val: 'HP OMEN 16' },
    { key: 'Kernel', val: 'Linux 6.8.0' },
    { key: 'Uptime', val: fmtUptime() },
    { key: 'Shell', val: 'zsh 5.9' },
    { key: 'Editor', val: 'VS Code / Neovim' },
    { key: 'DE', val: 'Hyprland' },
  ]

  return (
    <WidgetShell title="system_info.sys" accent="var(--mint)" style={{ animationDelay: '0ms' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* ASCII art mini */}
       <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8,
          color: 'var(--blue-sky)',
          lineHeight: 1.3,
          flexShrink: 0,
          whiteSpace: 'pre',
        }}
      >
      {`  /\\_/\\\\
 ( o.o )
  > ^ <`}
      </div>
        <div style={{ flex: 1 }}>
          {rows.map(r => (
            <div key={r.key} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--blue-sky)', minWidth: 46 }}>{r.key}:</span>
              <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Color swatches */}
      <div style={{ display: 'flex', gap: 2, marginTop: 8 }}>
        {['var(--bg-topbar)', 'var(--blue-deep)', 'var(--blue-primary)', 'var(--blue-bright)', 'var(--blue-sky)', 'var(--purple)', 'var(--border-window)', 'var(--bg-window)'].map(c => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
        ))}
      </div>
    </WidgetShell>
  )
}

function NowBuilding() {
  const [items, setItems] = useState<NowBuildingItem[]>([])

  const loadData = async () => {
    try {
      const data = await portfolioApi.getNowBuilding()
      setItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
    window.addEventListener('pushkaros-data-change', loadData)
    return () => window.removeEventListener('pushkaros-data-change', loadData)
  }, [])

  if (items.length === 0) return null

  return (
    <WidgetShell title="now_building.md" accent="var(--blue-bright)" style={{ animationDelay: '80ms' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: getThemeColor(item.dot), flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{item.text}</span>
        </div>
      ))}
    </WidgetShell>
  )
}
function CountUpNumber({ value, duration = 1000 }: { value: string | number; duration?: number }) {
  const [displayVal, setDisplayVal] = useState<string>('0')
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const str = value.toString()
    if (str === '—') {
      setDisplayVal('—')
      return
    }

    const match = str.match(/^(\d+)(.*)$/)
    if (!match) {
      setDisplayVal(str)
      return
    }

    const targetNum = parseInt(match[1], 10)
    const suffix = match[2] || ''
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = Math.floor(ease * targetNum)
      setDisplayVal(`${current}${suffix}`)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setDisplayVal(`${targetNum}${suffix}`)
      }
    }

    requestAnimationFrame(step)
  }, [value, duration])

  return <>{displayVal}</>
}

function LearningProgressBar({ pct, color }: { pct: number; color: string }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 60)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div style={{ height: 3, background: 'var(--border-light)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${width}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.85s cubic-bezier(0.16, 1, 0.3, 1)' }} />
    </div>
  )
}

function GitHubStats() {
  // prs and streak are nullable — display '—' when unavailable
  const [stats, setStats] = useState<{ repos: number; stars: number; streak: string | null; prs: number | null }>({
    repos: 0, stars: 0, streak: null, prs: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    portfolioApi.getGithubStats()
      .then(data => { setStats(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); })
  }, [])

  const displayStats = [
    { label: 'Repos', value: stats.repos.toString(), color: 'var(--blue-primary)' },
    { label: 'Stars', value: stats.stars.toString(), color: 'var(--amber)' },
    // streak and prs render '—' when null (backend parse/API failure)
    { label: 'Streak', value: stats.streak !== null ? stats.streak : '—', color: 'var(--mint)' },
    { label: 'PRs', value: stats.prs !== null ? stats.prs.toString() : '—', color: 'var(--purple)' },
  ]
  return (
    <WidgetShell title="github_stats.json" accent="var(--amber)" style={{ animationDelay: '160ms' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {displayStats.map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-window-alt)',
            border: '1px solid var(--border-light)',
            borderRadius: 6, padding: '8px 10px',
          }}>
            <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 700, color: loading ? 'var(--text-muted)' : s.color, lineHeight: 1, transition: 'color 0.4s' }}>
              {loading
                ? <span style={{ opacity: 0.35, animation: 'pulse 1.4s ease-in-out infinite', display: 'inline-block' }}>···</span>
                : <CountUpNumber key={`${s.label}-${s.value}`} value={s.value} />}
            </div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </WidgetShell>
  )
}

function CurrentlyLearning() {
  const [items, setItems] = useState<LearningItem[]>([])

  const loadData = async () => {
    try {
      const data = await portfolioApi.getLearningLog()
      setItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
    window.addEventListener('pushkaros-data-change', loadData)
    return () => window.removeEventListener('pushkaros-data-change', loadData)
  }, [])

  if (items.length === 0) return null
  return (
    <WidgetShell title="learning.log" accent="var(--purple)" style={{ animationDelay: '240ms' }}>
      {items.map(item => (
        <div key={item.name} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{item.name}</span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{item.pct}%</span>
          </div>
          <LearningProgressBar pct={item.pct} color={getThemeColor(item.color)} />
        </div>
      ))}
    </WidgetShell>
  )
}

function CoffeeCounter() {
  const [count, setCount] = useState(0)
  // mounted ref guards against setState on unmounted component (Issue 13)
  const mountedRef = useRef(true)

  const loadTea = async () => {
    try {
      const val = await portfolioApi.getCoffeeCount()
      if (mountedRef.current) setCount(val)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    mountedRef.current = true

    const handleVisit = async () => {
      try {
        const today = new Date().toDateString()
        const lastVisit = localStorage.getItem('pushkaros_last_visit')

        if (lastVisit !== today) {
          // First visit of the day: increment on the server atomically
          localStorage.setItem('pushkaros_last_visit', today)
          const newCount = await portfolioApi.saveCoffeeCount()
          if (mountedRef.current) setCount(newCount)
        } else {
          // Returning visit: just read the current count
          const currentCount = await portfolioApi.getCoffeeCount()
          if (mountedRef.current) setCount(currentCount)
        }
      } catch (e) {
        console.error(e)
      }
    }

    handleVisit()

    window.addEventListener('pushkaros-data-change', loadTea)
    return () => {
      mountedRef.current = false
      window.removeEventListener('pushkaros-data-change', loadTea)
    }
  }, [])

  const handleBrew = async () => {
    try {
      const newCount = await portfolioApi.saveCoffeeCount()
      if (mountedRef.current) setCount(newCount)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <WidgetShell title="coffee.sh" accent="#D97706" style={{ animationDelay: '320ms' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#D97706', lineHeight: 1 }}>
            {count} ☕
          </div>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2 }}>cups today</div>
        </div>
        <button
          onClick={handleBrew}
          style={{
            background: 'rgba(217, 119, 6, 0.15)',
            border: '1px solid rgba(217, 119, 6, 0.3)',
            borderRadius: 6, padding: '4px 10px',
            color: '#D97706', fontSize: 11,
            fontFamily: 'var(--font-mono)', cursor: 'pointer',
          }}
        >+ brew</button>
      </div>
    </WidgetShell>
  )
}

export default function SideWidgets() {
  return (
    <div style={{
      width: '280px',
      maxWidth: '100%',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      overflowY: 'auto',
      padding: '16px',
    }}>
      <Neofetch />
      <NowBuilding />
      <GitHubStats />
      <CurrentlyLearning />
      <CoffeeCounter />
    </div>
  )
}
