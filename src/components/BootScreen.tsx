import { useEffect, useState } from 'react'

const STEPS = [
  { text: 'Initializing PushkarOS v3.1.4...', delay: 0 },
  { text: 'Loading AI Modules............', delay: 500 },
  { text: 'Mounting /home/pushkar......', delay: 1000 },
  { text: 'Starting Neural Networks....', delay: 1500 },
  { text: 'Compiling Projects..........', delay: 2000 },
  { text: 'Launching Desktop...........', delay: 2500 },
]

interface Props {
  onComplete: () => void
}

export default function BootScreen({ onComplete }: Props) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => {
        setVisibleSteps(prev => [...prev, i])
        setProgress(Math.round(((i + 1) / STEPS.length) * 100))
      }, step.delay))
    })

    timers.push(setTimeout(() => setDone(true), 3200))
    timers.push(setTimeout(onComplete, 3900))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0B1220',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: done ? 0 : 1,
        transition: 'opacity 0.7s ease',
        pointerEvents: done ? 'none' : 'all',
      }}
    >
      <div style={{ width: 480, fontFamily: 'var(--font-mono)' }}>
        {/* Logo */}
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#fff',
            fontFamily: 'var(--font-display)',
          }}>P</div>
          <div>
            <div style={{ color: '#E2E8F0', fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              PushkarOS
            </div>
            <div style={{ color: '#475569', fontSize: 11 }}>Personal Development Environment v3.1.4</div>
          </div>
        </div>

        {/* Boot log */}
        <div style={{ marginBottom: 24, minHeight: 140 }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                fontSize: 12,
                color: visibleSteps.includes(i)
                  ? (i === STEPS.length - 1 ? '#34D399' : '#64748B')
                  : 'transparent',
                marginBottom: 6,
                display: 'flex', gap: 10, alignItems: 'center',
                transition: 'color 0.3s ease',
              }}
            >
              <span style={{ color: '#2563EB' }}>{'>'}</span>
              <span>{step.text}</span>
              {visibleSteps.includes(i) && i < STEPS.length - 1 && (
                <span style={{ color: '#34D399', marginLeft: 4 }}>OK</span>
              )}
              {i === STEPS.length - 1 && visibleSteps.includes(i) && (
                <span className="cursor-blink" style={{ color: '#34D399' }}>█</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: 'linear-gradient(90deg, #2563EB, #8B5CF6)',
            width: `${progress}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{ color: '#475569', fontSize: 11, marginTop: 8, textAlign: 'right' }}>{progress}%</div>
      </div>
    </div>
  )
}
