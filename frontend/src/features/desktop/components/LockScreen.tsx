/**
 * LockScreen.tsx — Idle Lock Screen for PushkarOS.
 *
 * Features:
 *   - Triggers after ~60s of inactivity (no mousemove, keypress, click, or touch).
 *   - Large live clock + full date display.
 *   - PushkarOS animated pixel wordmark (reusing font-pixel & gradient treatment from BootScreen).
 *   - DesktopBackground skyline backdrop + dark glassmorphic blur overlay.
 *   - Instant skip/dismiss on any user interaction (click, key, touch) without disturbing open windows.
 */
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import DesktopBackground from './DesktopBackground'

interface Props {
  idleTimeoutMs?: number
}

const DEFAULT_IDLE_TIMEOUT_MS = 60000 // 60 seconds
const WORDMARK = 'Pushkar OS'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
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

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Idle timer detection & activity reset
  useEffect(() => {
    let timeoutId: number

    const resetIdleTimer = () => {
      window.clearTimeout(timeoutId)
      // If locked, any interaction unlocks the screen
      setIsLocked(prevLocked => {
        if (prevLocked) return false
        return false
      })
      timeoutId = window.setTimeout(() => {
        setIsLocked(true)
      }, idleTimeoutMs)
    }

    // Set initial timeout
    timeoutId = window.setTimeout(() => {
      setIsLocked(true)
    }, idleTimeoutMs)

    // Listen for any user activity
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel']
    events.forEach(evt => window.addEventListener(evt, resetIdleTimer, { passive: true }))

    return () => {
      window.clearTimeout(timeoutId)
      events.forEach(evt => window.removeEventListener(evt, resetIdleTimer))
    }
  }, [idleTimeoutMs])

  // Format time and date
  const formattedTime = useMemo(() => {
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  }, [time])

  const formattedDate = useMemo(() => {
    return time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }, [time])

  const handleUnlock = () => {
    setIsLocked(false)
  }

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          key="lock-screen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={handleUnlock}
          onPointerDown={handleUnlock}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {/* Backdrop: Skyline Horizon Background + Dark Glassmorphic Overlay */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <DesktopBackground />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(10, 15, 30, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }} />
          </div>

          {/* Content Wrapper */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            padding: 32,
            textAlign: 'center',
          }}>
            {/* Reused PushkarOS Animated Pixel Wordmark */}
            <motion.div
              style={{
                display: 'flex',
                perspective: 500,
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(28px, 5vw, 44px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 8,
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
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
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
            </motion.div>

            {/* Large Live Digital Clock */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(42px, 8vw, 76px)',
              fontWeight: 700,
              color: '#F8FAFC',
              letterSpacing: '-0.03em',
              textShadow: '0 4px 24px rgba(37, 99, 235, 0.35)',
              lineHeight: 1,
            }}>
              {formattedTime}
            </div>

            {/* Date Display */}
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(14px, 2.5vw, 18px)',
              fontWeight: 500,
              color: 'rgba(148, 163, 184, 0.85)',
              letterSpacing: '0.02em',
            }}>
              {formattedDate}
            </div>

            {/* Interactive Unlock Prompt */}
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                marginTop: 36,
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: 'rgba(148, 163, 184, 0.65)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '8px 20px',
                borderRadius: 20,
              }}
            >
              Press any key, click, or tap to unlock
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
