import { useState, useEffect } from 'react'
import { portfolioApi, NowBuildingItem, LearningItem } from '../services/api'

function WidgetShell({ title, children, accent = '#3B82F6' }: {
  title: string
  children: React.ReactNode
  accent?: string
}) {
  return (
    <div className="window" style={{ overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
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
    <WidgetShell title="system_info.sys" accent="#34D399">
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* ASCII art mini */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--blue-sky)', lineHeight: 1.3, flexShrink: 0 }}>
          {`  /\\_/\\  \n ( o.o ) \n  > ^ <  `}
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
        {['#1E2333', '#2563EB', '#34D399', '#F59E0B', '#8B5CF6', '#EF4444', '#22D3EE', '#E2E8F0'].map(c => (
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
    <WidgetShell title="now_building.md" accent="#3B82F6">
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{item.text}</span>
        </div>
      ))}
    </WidgetShell>
  )
}

function GitHubStats() {
  const [stats, setStats] = useState({ repos: 42, stars: 180, streak: '28d', prs: 76 })

  useEffect(() => {
    portfolioApi.getGithubStats().then(setStats).catch(console.error)
  }, [])

  const displayStats = [
    { label: 'Repos', value: stats.repos.toString(), color: '#3B82F6' },
    { label: 'Stars', value: stats.stars.toString(), color: '#F59E0B' },
    { label: 'Streak', value: stats.streak, color: '#34D399' },
    { label: 'PRs', value: stats.prs.toString(), color: '#8B5CF6' },
  ]
  return (
    <WidgetShell title="github_stats.json" accent="#F59E0B">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {displayStats.map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-window-alt)',
            border: '1px solid var(--border-light)',
            borderRadius: 6, padding: '8px 10px',
          }}>
            <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
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
    <WidgetShell title="learning.log" accent="#8B5CF6">
      {items.map(item => (
        <div key={item.name} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{item.name}</span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{item.pct}%</span>
          </div>
          <div style={{ height: 3, background: 'var(--border-light)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 2, transition: 'width 1s ease' }} />
          </div>
        </div>
      ))}
    </WidgetShell>
  )
}

function TeaCounter() {
  const [count, setCount] = useState(0)

  const loadTea = async () => {
    try {
      const val = await portfolioApi.getCoffeeCount()
      setCount(val)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const handleVisit = async () => {
      try {
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('pushkaros_last_visit');
        
        const currentCount = await portfolioApi.getCoffeeCount();
        
        if (lastVisit !== today) {
          localStorage.setItem('pushkaros_last_visit', today);
          await portfolioApi.saveCoffeeCount(currentCount + 1);
        } else {
          setCount(currentCount);
        }
      } catch (e) {
        console.error(e);
      }
    };

    handleVisit();

    window.addEventListener('pushkaros-data-change', loadTea)
    return () => window.removeEventListener('pushkaros-data-change', loadTea)
  }, [])

  const handleBrew = async () => {
    const next = count + 1
    try {
      await portfolioApi.saveCoffeeCount(next)
      setCount(next)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <WidgetShell title="tea.sh" accent="#10B981">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#10B981', lineHeight: 1 }}>
            {count} 🍵
          </div>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2 }}>cups today</div>
        </div>
        <button
          onClick={handleBrew}
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 6, padding: '4px 10px',
            color: '#10B981', fontSize: 11,
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
      <TeaCounter />
    </div>
  )
}
