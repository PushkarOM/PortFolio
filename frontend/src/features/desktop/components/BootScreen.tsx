import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { getSystemInfo } from '../../../shared/utils/systemInfo'

interface Props {
  onComplete: () => void
}

const LINE_STAGGER_MS = 165
const HOLD_MS = 750
const FADE_OUT_MS = 500
const REPEAT_HOLD_MS = 550

const WORDMARK = 'Pushkar OS'
const SESSION_KEY = 'pushkaros-booted'

type Stage = 'post' | 'brand'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.08 },
  },
}

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 26, rotateX: -80, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
    transition: { type: 'spring', damping: 14, stiffness: 180 },
  },
}

export default function BootScreen({ onComplete }: Props) {
  const reducedMotion = useMemo(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    []
  )
  const alreadyBooted = useMemo(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      return false
    }
  }, [])

  const info = useMemo(() => getSystemInfo(), [])
  const lines = useMemo(
    () => [
      'Initializing PushkarOS v3.1.4...',
      `OS: ${info.os}`,
      `Browser: ${info.browser}`,
      `Display: ${info.display}`,
      `GPU: ${info.gpu}`,
      `CPU: ${info.cpuCores}`,
      `Memory: ${info.memory}`,
      `Timezone: ${info.timezone}`,
      `Network: ${info.connection}`,
    ],
    [info]
  )

  // Skip the POST log entirely on repeat visits or when the visitor prefers reduced motion.
  const skipIntro = reducedMotion || alreadyBooted
  const [stage, setStage] = useState<Stage>(skipIntro ? 'brand' : 'post')
  const [visibleLines, setVisibleLines] = useState(0)
  const [fading, setFading] = useState(false)
  const skippedRef = useRef(false)

  const finish = () => {
    if (skippedRef.current) return
    skippedRef.current = true
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* ignore */
    }
    setFading(true)
    setTimeout(onComplete, skipIntro ? 250 : FADE_OUT_MS)
  }

  // Repeat-visit / reduced-motion path — hold the settled wordmark briefly, then go.
  useEffect(() => {
    if (skipIntro) {
      const t = setTimeout(finish, reducedMotion ? 150 : REPEAT_HOLD_MS)
      return () => clearTimeout(t)
    }
  }, [])

  // Stage 1 — POST log, built from real detected values, line by line.
  useEffect(() => {
    if (stage !== 'post') return
    const timers: ReturnType<typeof setTimeout>[] = []
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), i * LINE_STAGGER_MS))
    })
    timers.push(setTimeout(() => setStage('brand'), lines.length * LINE_STAGGER_MS + 350))
    return () => timers.forEach(clearTimeout)
  }, [stage, lines])

  // Global skip — any key or click jumps straight to the desktop.
  useEffect(() => {
    const skip = () => finish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0B1220',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_OUT_MS}ms ease`,
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      {stage === 'post' && (
        <div
          style={{
            width: 480,
            height: 160,
            overflow: 'hidden',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <AnimatePresence initial={false}>
            {lines.slice(0, visibleLines).map((line, i) => {
              const distFromLatest = visibleLines - 1 - i
              const opacity = Math.max(0.35, 1 - distFromLatest * 0.15)

              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  style={{
                    fontSize: 12,
                    color: i === 0 ? '#64748B' : '#94A3B8',
                    marginBottom: 6,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ color: '#2563EB' }}>{'>'}</span>
                  <span>{line}</span>
                  {i > 0 && <span style={{ color: '#3B82F6', marginLeft: 4 }}>OK</span>}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {stage === 'brand' && (
        <motion.div
          style={{
            display: 'flex',
            perspective: 500,
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(32px, 6vw, 52px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
          variants={containerVariants}
          initial={skipIntro ? 'visible' : 'hidden'}
          animate="visible"
          onAnimationComplete={() => {
            if (!skipIntro) setTimeout(finish, HOLD_MS)
          }}
        >
          {WORDMARK.split('').map((ch, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              style={{
                display: 'inline-block',
                backgroundImage: 'linear-gradient(135deg, #60A5FA, #2563EB, #1E3A8A)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  )
}
