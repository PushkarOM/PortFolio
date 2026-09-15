/**
 * LockScreen.tsx - Idle Lock Screen for PushkarOS.
 *
 * Performance notes:
 *   - isLocked is NOT in the idle-timer effect dep array - tracked via local variable
 *     to avoid teardown/re-add of 6 event listeners on every lock/unlock toggle.
 *   - Clock setInterval only active while isLocked === true.
 *   - No nested DesktopBackground: blur makes skyline invisible, and the duplicate
 *     component added a RAF loop, 2 setIntervals, a MutationObserver, and resize listener.
 */
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

interface Props {
  idleTimeoutMs?: number
}

const DEFAULT_IDLE_TIMEOUT_MS = 60000
const WORDMARK = 'Pushkar OS'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20, rotateX: -60, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
    transition: { type: 'spring', damping: 14, stiffness: 180 },
  },
}

export default function LockScreen({ idleTimeoutMs = DEFAULT_IDLE_TIMEOUT_MS }: Props) {
  const [isLocked, setIsLocked] = useState(false)
  const [time, setTime] = useState(new Date())

  // Clock ticks ONLY while lock screen is visible
  useEffect(() => {
    if (!isLocked) return
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [isLocked])

  // Idle timer + keypress-only wake-up.
  // lockedState mirrors isLocked inside the closure without capturing it as a dep,
  // so the 6 listeners are NOT torn down and re-added on every lock/unlock flip.
  useEffect(() => {
    let timeoutId: number
    let lockedState = false

    const scheduleTimeout = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        lockedState = true
        setIsLocked(true)
      }, idleTimeoutMs)
    }

    const handleActivity = (e: Event) => {
      if (lockedState) {
        if (e.type === 'keydown') {
          lockedState = false
          setIsLocked(false)
          scheduleTimeout()
        }
        return
      }
      scheduleTimeout()
    }

    scheduleTimeout()
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel']
    events.forEach(evt => window.addEventListener(evt, handleActivity, { passive: true }))
    return () => {
      window.clearTimeout(timeoutId)
      events.forEach(evt => window.removeEventListener(evt, handleActivity))
    }
  }, [idleTimeoutMs])

  const formattedTime = useMemo(() =>
    time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  , [time])

  const formattedDate = useMemo(() =>
    time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  , [time])

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          key="lock-screen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', userSelect: 'none',
          }}
        >
          {/* Dark gradient backdrop - replaces the nested DesktopBackground */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
            background: 'linear-gradient(160deg, #060D18 0%, #0B1220 50%, #0D1526 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(10, 15, 30, 0.65)',
          }} />

          <div style={{
            position: 'relative', zIndex: 2,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 20, padding: 32, textAlign: 'center',
          }}>
            <motion.div
              style={{
                display: 'flex', perspective: 500,
                fontFamily: 'var(--font-pixel)', fontSize: 'clamp(28px, 5vw, 44px)',
                fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8,
              }}
              variants={containerVariants} initial="hidden" animate="visible"
            >
              {WORDMARK.split('').map((ch, i) => (
                <motion.span
                  key={i} variants={letterVariants}
                  style={{
                    display: 'inline-block',
                    backgroundImage: 'linear-gradient(135deg, #60A5FA, #2563EB, #1E3A8A)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                  }}
                >
                  {ch === ' ' ? '\u00a0' : ch}
                </motion.span>
              ))}
            </motion.div>

            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 'clamp(42px, 8vw, 76px)',
              fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.03em',
              textShadow: '0 4px 24px rgba(37, 99, 235, 0.35)', lineHeight: 1,
            }}>
              {formattedTime}
            </div>

            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 2.5vw, 18px)',
              fontWeight: 500, color: 'rgba(148, 163, 184, 0.85)', letterSpacing: '0.02em',
            }}>
              {formattedDate}
            </div>

            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                marginTop: 36, fontSize: 12, fontFamily: 'var(--font-mono)',
                color: 'rgba(148, 163, 184, 0.65)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '8px 20px', borderRadius: 20,
              }}
            >
              ⌨️ Press any key to wake up
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
