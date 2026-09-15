/**
 * NekoKat — Cursor-following cat using individual cropped frame PNGs.
 *
 * Sprites: /sprites/cat/idle_1..7.png, walk_1..7.png, happy_1..5.png, heart_icon.png
 *
 * State Machine (Strictly 3 States):
 *   1. IDLE  : Cat sits static (holding idle_1.png). Periodically plays subtle micro-animation
 *              (idle_1..7) every 3-5 seconds before resting static again.
 *   2. WALK  : Cycle walk_1..7 on smooth walk loop (~140ms/frame) while moving. Drops back to IDLE when reached.
 *   3. HAPPY : Plays happy_1..5 ONCE (~150ms/frame) on click, with heart_icon popup overlay.
 *              Returns to IDLE/WALK after finishing.
 *
 * High-performance RAF loop with 0 React re-renders.
 */
import { useEffect, useRef } from 'react'

// ─── Image Frame Paths ───────────────────────────────────────────────
const IDLE_FRAMES  = Array.from({ length: 7 }, (_, i) => `/sprites/cat/idle_${i + 1}.png`)
const WALK_FRAMES  = Array.from({ length: 7 }, (_, i) => `/sprites/cat/walk_${i + 1}.png`)
const HAPPY_FRAMES = Array.from({ length: 5 }, (_, i) => `/sprites/cat/happy_${i + 1}.png`)
const HEART_ICON   = '/sprites/cat/heart_icon.png'

const ALL_PATHS = [...IDLE_FRAMES, ...WALK_FRAMES, ...HAPPY_FRAMES, HEART_ICON]

type CatState = 'IDLE' | 'WALK' | 'HAPPY'

const CANVAS_W = 128
const CANVAS_H = 128
const SCALE    = 0.68 // Fits ~105px frames into ~72px visual size with ample headroom for floating heart

// Frame intervals (ms)
const IDLE_INTERVAL   = 380
const WALK_INTERVAL   = 140
const HAPPY_INTERVAL  = 150

// Idle static pause range (ms) — cat sits calmly static between subtle twitches
const IDLE_PAUSE_MIN  = 2800
const IDLE_PAUSE_MAX  = 4800

// Physics constants
const START_THRESHOLD = 150  // Wake up & start walking when cursor moves > 150px away
const STOP_THRESHOLD  = 88   // Stop walking & sit 88px away from cursor (generous buffer distance)
const MAX_SPEED       = 3.2  // Max speed (px/frame)
const APPROACH_RATE   = 0.13 // Deceleration rate near target
const FLIP_DEADZONE   = 4    // Deadzone to prevent rapid facing flips

export default function NekoKat() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<Record<string, HTMLImageElement>>({})

  // Cat world position (feet baseline center)
  const posRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.15 : 200,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.65 : 400,
  })

  // Cursor target position
  const targetRef = useRef({ x: posRef.current.x, y: posRef.current.y })

  // State Machine refs
  const stateRef             = useRef<CatState>('IDLE')
  const stepRef              = useRef(0)
  const stepMsRef            = useRef(0)
  const happyElapsedRef      = useRef(0)
  const isIdlePausingRef     = useRef(true) // Start in calm static pose
  const idlePauseMsRef       = useRef(0)
  const idlePauseDurationRef = useRef(3000)
  const flipRef              = useRef(false) // true = facing left

  const rafRef    = useRef<number | null>(null)
  const lastTsRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false

    // Preload all frame images
    ALL_PATHS.forEach(path => {
      const img = new Image()
      img.src = path
      img.onload = () => {
        imagesRef.current[path] = img
      }
    })

    // Reduced motion fallback
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mql.matches) {
      const idle1 = imagesRef.current[IDLE_FRAMES[0]]
      if (idle1 && idle1.complete) {
        const dw = Math.round(idle1.width * SCALE)
        const dh = Math.round(idle1.height * SCALE)
        ctx.drawImage(idle1, Math.round((CANVAS_W - dw) / 2), Math.round(CANVAS_H - dh), dw, dh)
      }
      return
    }

    // Pointer move updates target ref silently (0 re-renders)
    const onMove = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }

    // Main RAF Animation & Physics Loop
    const tick = (ts: number) => {
      const dt = Math.min(ts - lastTsRef.current, 64)
      lastTsRef.current = ts

      const winW = typeof window !== 'undefined' ? window.innerWidth : 1200
      const winH = typeof window !== 'undefined' ? window.innerHeight : 800

      // Viewport & TopBar boundaries:
      // TopBar is 36px high; cat is ~65px tall. Clamping pos.y >= 102px keeps cat ears strictly below TopBar.
      const TOPBAR_MIN_Y = 102
      const SCREEN_MARGIN_X = 40
      const SCREEN_MARGIN_BOTTOM = 24

      const pos    = posRef.current
      const rawTarget = targetRef.current

      // Clamped target destination inside valid desktop area
      const targetX = Math.max(SCREEN_MARGIN_X, Math.min(winW - SCREEN_MARGIN_X, rawTarget.x))
      const targetY = Math.max(TOPBAR_MIN_Y, Math.min(winH - SCREEN_MARGIN_BOTTOM, rawTarget.y))

      const dx     = targetX - pos.x
      const dy     = targetY - pos.y
      const dist   = Math.hypot(dx, dy)

      const currentState = stateRef.current

      // ─── State Machine Transitions ──────────────────────────────────
      if (currentState === 'HAPPY') {
        happyElapsedRef.current += dt
        stepMsRef.current += dt
        if (stepMsRef.current >= HAPPY_INTERVAL) {
          stepMsRef.current -= HAPPY_INTERVAL
          const nextStep = stepRef.current + 1

          if (nextStep >= HAPPY_FRAMES.length) {
            // Happy sequence complete -> return to WALK or IDLE
            const nextState: CatState = dist > START_THRESHOLD ? 'WALK' : 'IDLE'
            stateRef.current             = nextState
            stepRef.current              = 0
            stepMsRef.current            = 0
            happyElapsedRef.current      = 0
            isIdlePausingRef.current     = true
            idlePauseMsRef.current       = 0
            idlePauseDurationRef.current = 2000
          } else {
            stepRef.current = nextStep
          }
        }
      } else if (currentState === 'WALK') {
        // Check if reached cursor
        if (dist < STOP_THRESHOLD) {
          stateRef.current             = 'IDLE'
          stepRef.current              = 0
          stepMsRef.current            = 0
          isIdlePausingRef.current     = true
          idlePauseMsRef.current       = 0
          idlePauseDurationRef.current = IDLE_PAUSE_MIN + Math.random() * (IDLE_PAUSE_MAX - IDLE_PAUSE_MIN)
        } else {
          // Physics movement
          const spd = Math.min(MAX_SPEED, dist * APPROACH_RATE) * (dt / 16.67)
          pos.x += (dx / dist) * spd
          pos.y += (dy / dist) * spd

          // Clamp position strictly within desktop bounds
          pos.x = Math.max(SCREEN_MARGIN_X, Math.min(winW - SCREEN_MARGIN_X, pos.x))
          pos.y = Math.max(TOPBAR_MIN_Y, Math.min(winH - SCREEN_MARGIN_BOTTOM, pos.y))

          // Facing direction with deadzone
          if (dx > FLIP_DEADZONE) flipRef.current = false
          if (dx < -FLIP_DEADZONE) flipRef.current = true

          // Walk animation step
          stepMsRef.current += dt
          if (stepMsRef.current >= WALK_INTERVAL) {
            stepMsRef.current -= WALK_INTERVAL
            stepRef.current    = (stepRef.current + 1) % WALK_FRAMES.length
          }
        }
      } else {
        // ─── IDLE state (Static sitting + periodic micro-animations) ───
        if (dist > START_THRESHOLD) {
          stateRef.current  = 'WALK'
          stepRef.current   = 0
          stepMsRef.current = 0
        } else if (isIdlePausingRef.current) {
          // Cat is sitting completely static in idle_1 pose
          idlePauseMsRef.current += dt
          if (idlePauseMsRef.current >= idlePauseDurationRef.current) {
            // Pause finished -> trigger subtle tail twitch / glance sequence
            isIdlePausingRef.current = false
            stepRef.current   = 0
            stepMsRef.current = 0
          }
        } else {
          // Play through idle_1..7 micro-animation
          stepMsRef.current += dt
          if (stepMsRef.current >= IDLE_INTERVAL) {
            stepMsRef.current -= IDLE_INTERVAL
            const nextStep = stepRef.current + 1

            if (nextStep >= IDLE_FRAMES.length) {
              // Micro-anim finished -> return to static sitting pose for 3-5 seconds
              stepRef.current              = 0
              isIdlePausingRef.current     = true
              idlePauseMsRef.current       = 0
              idlePauseDurationRef.current = IDLE_PAUSE_MIN + Math.random() * (IDLE_PAUSE_MAX - IDLE_PAUSE_MIN)
            } else {
              stepRef.current = nextStep
            }
          }
        }
      }

      // ─── Render Active State Frame ──────────────────────────────────
      const activeState = stateRef.current
      let currentPath = IDLE_FRAMES[0]

      if (activeState === 'HAPPY') {
        currentPath = HAPPY_FRAMES[Math.min(stepRef.current, HAPPY_FRAMES.length - 1)]
      } else if (activeState === 'WALK') {
        currentPath = WALK_FRAMES[stepRef.current % WALK_FRAMES.length]
      } else {
        // In IDLE: if static pausing, show idle_1.png; otherwise show current animation step
        if (isIdlePausingRef.current) {
          currentPath = IDLE_FRAMES[0]
        } else {
          currentPath = IDLE_FRAMES[stepRef.current % IDLE_FRAMES.length]
        }
      }

      const img = imagesRef.current[currentPath]
      if (img && img.complete) {
        const dw = Math.round(img.width * SCALE)
        const dh = Math.round(img.height * SCALE)
        const dxPos = Math.round((CANVAS_W - dw) / 2)
        const dyPos = Math.round(CANVAS_H - dh)

        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

        if (flipRef.current) {
          ctx.save()
          ctx.translate(CANVAS_W, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(img, dxPos, dyPos, dw, dh)
          ctx.restore()
        } else {
          ctx.drawImage(img, dxPos, dyPos, dw, dh)
        }

        // Render Heart Overlay when in HAPPY state
        if (activeState === 'HAPPY') {
          const heartImg = imagesRef.current[HEART_ICON]
          if (heartImg && heartImg.complete) {
            const totalHappyTime = HAPPY_FRAMES.length * HAPPY_INTERVAL
            const progress = Math.min(1, happyElapsedRef.current / totalHappyTime)

            let alpha = 1
            if (progress < 0.2) {
              alpha = progress / 0.2
            } else if (progress > 0.75) {
              alpha = Math.max(0, (1 - progress) / 0.25)
            }

            const hw = Math.round(heartImg.width * 0.32)
            const hh = Math.round(heartImg.height * 0.32)
            const hx = Math.round((CANVAS_W - hw) / 2 + (flipRef.current ? -8 : 8))
            const hy = Math.round(dyPos - hh - 6 - progress * 18)

            ctx.save()
            ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
            ctx.drawImage(heartImg, hx, hy, hw, hh)
            ctx.restore()
          }
        }
      }

      // Reposition canvas container via GPU transform
      const cx = Math.round(pos.x - CANVAS_W / 2)
      const cy = Math.round(pos.y - CANVAS_H)
      canvas.style.transform = `translate(${cx}px, ${cy}px)`

      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    lastTsRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Trigger HAPPY sequence on cat click
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    stateRef.current        = 'HAPPY'
    stepRef.current         = 0
    stepMsRef.current       = 0
    happyElapsedRef.current = 0
  }

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      aria-hidden="true"
      onPointerDown={handlePointerDown}
      title="Click to pet Neko! 💕"
      style={{
        position:       'fixed',
        top:            0,
        left:           0,
        width:          CANVAS_W,
        height:         CANVAS_H,
        imageRendering: 'pixelated',
        pointerEvents:  'auto',
        cursor:         'pointer',
        userSelect:     'none',
        zIndex:         99999,
        willChange:     'transform',
        transform:      `translate(${Math.round(posRef.current.x - CANVAS_W / 2)}px, ${Math.round(posRef.current.y - CANVAS_H)}px)`,
      }}
    />
  )
}
