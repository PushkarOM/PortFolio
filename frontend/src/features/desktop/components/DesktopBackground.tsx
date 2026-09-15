import { useEffect, useRef, useState, useCallback } from 'react'
import MatrixRain from './MatrixRain'

// ─── Colour helpers ──────────────────────────────────────────────────────────
// We need per-theme opacity/color values because this component uses inline SVG
// that can't take advantage of CSS var() computed differently per theme for
// things like absolute opacity numbers.  We read data-theme from <html>.

type Theme = 'aurora' | 'midnight' | 'retro' | 'matrix'

function useCurrentTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = document.documentElement.getAttribute('data-theme')
    return (t as Theme) || 'aurora'
  })

  useEffect(() => {
    const obs = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-theme')
      setTheme((t as Theme) || 'aurora')
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  return theme
}

// Per-theme skyline + doodle visual config
const THEME_CONFIG: Record<Theme, {
  skylineOpacity: number
  nearFill: string[]   // 3 fill colours for near-row buildings
  farFill: string[]    // 3 fill colours for far-row buildings
  windowFill: string
  doodleOpacity: number
  doodleColor: string
  wordmarkOpacity: number
  wordmarkFill: string // per-theme fill so matrix/retro aren't hardcoded blue
  cloudFill: string
}> = {
  aurora: {
    // Light desktop (#F8FAFC) — needs strong contrast so use full deep/primary blues
    skylineOpacity: 0.22,
    nearFill: ['#1E3A8A', '#2563EB', '#1D4ED8'],
    farFill:  ['#2563EB', '#3B82F6', '#1E40AF'],
    windowFill: '#93C5FD',
    doodleOpacity: 0.38,
    doodleColor: '#1E3A8A',
    // Aurora: light BG needs deeper blue, higher opacity to be legible at horizon
    wordmarkOpacity: 0.14,
    wordmarkFill: '#1E3A8A',
    cloudFill: '#60A5FA',
  },
  midnight: {
    skylineOpacity: 0.30,
    nearFill: ['#1E3A8A', '#1e4d87', '#1a3472'],
    farFill:  ['#0f2557', '#162d6e', '#0d2050'],
    windowFill: '#60A5FA',
    doodleOpacity: 0.22,
    doodleColor: '#60A5FA',
    wordmarkOpacity: 0.18,
    wordmarkFill: '#3B82F6',
    cloudFill: '#3B82F6',
  },
  retro: {
    skylineOpacity: 0.20,
    nearFill: ['#543E0C', '#6B4F14', '#78631a'],
    farFill:  ['#6B4F14', '#8B6914', '#a07820'],
    windowFill: '#C5A059',
    doodleOpacity: 0.28,
    doodleColor: '#8B6914',
    wordmarkOpacity: 0.16,
    wordmarkFill: '#A07820',
    cloudFill: '#A07820',
  },
  matrix: {
    skylineOpacity: 0.35,
    nearFill: ['#003300', '#004d00', '#006600'],
    farFill:  ['#001a00', '#002200', '#003300'],
    windowFill: '#00FF41',
    doodleOpacity: 0.32,
    doodleColor: '#00FF41',
    wordmarkOpacity: 0.20,
    wordmarkFill: '#00FF41',
    cloudFill: '#00CC33',
  },
}

// ─── Layer 0: Horizon "PushkarOS" wordmark ───────────────────────────────────
// Sits in the SVG at y=196 (just above the ground line at y=200), rendered BEFORE
// the building rects, so building silhouettes paint over the bottom portion of
// the letters — like a city skyline rising in front of a glowing sign.
// fontSize=90 in a 200-unit tall viewBox means the text body is ~45% of the strip
// height, so the upper half of each letter clears the tallest near buildings.

function HorizonWordmark({ theme }: { theme: Theme }) {
  const cfg = THEME_CONFIG[theme]
  return (
    <text
      x="500"
      y="-5"
      textAnchor="middle"
      dominantBaseline="auto"
      style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 90,
        fill: cfg.wordmarkFill,
        opacity: cfg.wordmarkOpacity,
        letterSpacing: 6,
        userSelect: 'none',
      }}
    >
      PushkarOS
    </text>
  )
}

// ─── Layer 1: Dual-depth skyline ─────────────────────────────────────────────
// FAR row: shorter buildings, lighter fill, slower parallax (handled by parent)
// NEAR row: taller buildings, darker fill, faster parallax

// Building: [x, width, height]
const FAR_BUILDINGS: [number, number, number][] = [
  [30,  40,  64],  [90,  24,  88],  [130, 40,  56],
  [195, 32,  96],  [248, 48,  72],  [310, 24,  104],
  [355, 40,  80],  [415, 56,  88],  [488, 32,  64],
  [540, 48,  112], [608, 40,  80],  [668, 24,  96],
  [710, 56,  88],  [785, 32,  72],  [840, 48,  96],
  [910, 40,  64],  [965, 24,  80],
]

const NEAR_BUILDINGS: [number, number, number][] = [
  [0,   56,  96],  [48,  32,  136], [72,  48,  80],
  [112, 40,  152], [144, 24,  112], [160, 56,  168],
  [208, 32,  104], [232, 48,  176], [272, 40,  128],
  [304, 64,  88],  [360, 32,  144], [384, 48,  160],
  [424, 56,  96],  [472, 24,  192], [488, 40,  120],
  [520, 64,  144], [576, 32,  80],  [600, 48,  176],
  [640, 40,  104], [672, 56,  160], [720, 32,  136],
  [744, 48,  96],  [784, 40,  184], [816, 64,  128],
  [872, 32,  112], [896, 48,  168], [936, 40,  88],
  [968, 56,  144],
]

// Pre-compute which window cells are lit — stable, derived from position only
function computeWindowDots(
  buildings: [number, number, number][]
): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = []
  for (const [bx, bw, bh] of buildings) {
    const cols = Math.floor(bw / 12)
    const rows = Math.floor(bh / 16)
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (Math.sin(bx * 0.17 + r * 3.1 + c * 7.3) > 0.15) {
          dots.push({ x: bx + c * 12 + 4, y: 200 - bh + r * 16 + 4 })
        }
      }
    }
  }
  return dots
}

const NEAR_DOTS_ALL = computeWindowDots(NEAR_BUILDINGS)
const FAR_DOTS_ALL  = computeWindowDots(FAR_BUILDINGS)
const TOTAL_NEAR = NEAR_DOTS_ALL.length
const TOTAL_FAR  = FAR_DOTS_ALL.length

// ─── Flicker state hook ───────────────────────────────────────────────────────
// Randomly toggles a small fraction of window-lights every few seconds.

function useFlicker(totalDots: number): Set<number> {
  const [litSet, setLitSet] = useState<Set<number>>(() => {
    // Initial lit set — deterministic subset
    const s = new Set<number>()
    for (let i = 0; i < totalDots; i++) {
      if (Math.sin(i * 4.71 + 1.23) > 0) s.add(i)
    }
    return s
  })

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Toggle 1–2 random lights every 2–4 seconds
    const tick = () => {
      setLitSet(prev => {
        const next = new Set(prev)
        const toggleCount = 1 + Math.floor(Math.random() * 2)
        for (let t = 0; t < toggleCount; t++) {
          const idx = Math.floor(Math.random() * totalDots)
          if (next.has(idx)) next.delete(idx)
          else next.add(idx)
        }
        return next
      })
    }

    // Stagger initial tick to avoid all instances firing together
    const jitter = 1000 + Math.random() * 2000
    const id = setInterval(tick, 2500 + Math.random() * 1500)
    const jitterId = setTimeout(tick, jitter)

    return () => {
      clearInterval(id)
      clearTimeout(jitterId)
    }
  }, [totalDots])

  return litSet
}

// Clouds: chunky blocky pixel shapes
const CLOUDS = [
  { cx: 100, cy: 38 }, { cx: 360, cy: 26 }, { cx: 600, cy: 46 }, { cx: 810, cy: 32 },
]

function SkylineLayer({
  buildings,
  dots,
  litSet,
  fills,
  windowFill,
  cloudFill,
  showClouds,
  opacity,
  isMobile,
}: {
  buildings: [number, number, number][]
  dots: { x: number; y: number }[]
  litSet: Set<number>
  fills: string[]
  windowFill: string
  cloudFill: string
  showClouds: boolean
  opacity: number
  isMobile?: boolean
}) {
  return (
    <svg
      viewBox="0 0 1000 200"
      width="100%"
      height="200"
      preserveAspectRatio="xMidYMax meet"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        opacity,
        transform: isMobile ? 'scale(1.75)' : 'none',
        transformOrigin: 'bottom center',
      }}
    >
      {showClouds && CLOUDS.map(({ cx, cy }, i) => (
        <g key={i}>
          <rect x={cx}      y={cy + 8} width={32} height={16} fill={cloudFill} />
          <rect x={cx + 8}  y={cy}     width={32} height={16} fill={cloudFill} />
          <rect x={cx + 24} y={cy + 8} width={24} height={16} fill={cloudFill} />
          <rect x={cx + 16} y={cy + 8} width={8}  height={16} fill={cloudFill} />
        </g>
      ))}

      {buildings.map(([bx, bw, bh], i) => (
        <rect key={i} x={bx} y={200 - bh} width={bw} height={bh} fill={fills[i % 3]} />
      ))}

      {dots
        .map((d, i) => ({ d, i }))
        .filter(({ i }) => litSet.has(i))
        .map(({ d, i }) => (
          <rect key={i} x={d.x} y={d.y} width={6} height={6} fill={windowFill} opacity={0.8} />
        ))}

      <rect x={0} y={198} width={1000} height={4} fill={fills[0]} />
    </svg>
  )
}

// ─── Layer 2: Pixel-art SVG sprite doodles ───────────────────────────────────
// Each doodle is a small inline SVG built from <rect> elements on a fixed pixel
// grid (each "pixel" = 2 SVG units), giving a true blocky/8-bit appearance
// instead of font glyphs.

// Curly brace { }  — 14×20 grid
function CurlyBraceSprite({ fill }: { fill: string }) {
  const p = (x: number, y: number, w = 1, h = 1) => (
    <rect x={x * 2} y={y * 2} width={w * 2} height={h * 2} fill={fill} />
  )
  return (
    <svg viewBox="0 0 30 42" width={30} height={42}>
      {/* { */}
      {p(2,0)} {p(1,1)} {p(1,2)} {p(1,3)} {p(0,4)} {p(1,5)} {p(1,6)} {p(1,7)} {p(2,8)} {p(2,9)}
      {/* } */}
      {p(10,0)} {p(11,1)} {p(11,2)} {p(11,3)} {p(12,4)} {p(11,5)} {p(11,6)} {p(11,7)} {p(10,8)} {p(10,9)}
    </svg>
  )
}

// </> tag  — 18×12 grid
function TagSprite({ fill }: { fill: string }) {
  const p = (x: number, y: number, w = 1, h = 1) => (
    <rect x={x * 2} y={y * 2} width={w * 2} height={h * 2} fill={fill} />
  )
  return (
    <svg viewBox="0 0 40 26" width={40} height={26}>
      {/* < arrow */}
      {p(3,3)} {p(2,4)} {p(1,5)} {p(0,6)} {p(1,7)} {p(2,8)} {p(3,9)}
      {/* / */}
      {p(9,1)} {p(8,3)} {p(7,5)} {p(6,7)} {p(5,9)} {p(4,11)}
      {/* > arrow */}
      {p(12,3)} {p(13,4)} {p(14,5)} {p(15,6)} {p(14,7)} {p(13,8)} {p(12,9)}
    </svg>
  )
}

// Git branch  — forked path made of pixel squares
function GitBranchSprite({ fill }: { fill: string }) {
  const p = (x: number, y: number) => (
    <rect x={x * 3} y={y * 3} width={3} height={3} fill={fill} />
  )
  return (
    <svg viewBox="0 0 48 54" width={32} height={36}>
      {/* Main stem */}
      {p(2,0)} {p(2,1)} {p(2,2)} {p(2,3)} {p(2,4)}
      {/* Branch point */}
      {p(2,4)} {p(3,4)} {p(4,4)} {p(5,4)} {p(6,4)} {p(7,4)}
      {/* Branch curves up */}
      {p(7,3)} {p(7,2)} {p(7,1)} {p(7,0)}
      {/* Main continues down */}
      {p(2,5)} {p(2,6)} {p(2,7)}
      {/* Commit dots */}
      {p(1,0)} {p(3,0)}  {/* top node */}
      {p(6,0)} {p(8,0)}  {/* branch node */}
      {p(1,7)} {p(3,7)}  {/* bottom node */}
    </svg>
  )
}

// Terminal cursor block  — simple 3×4 chunky block with blink class
function CursorSprite({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 14 20" width={14} height={20}>
      <rect x={0} y={0} width={14} height={20} fill={fill} className="cursor-blink" />
    </svg>
  )
}

// Binary string  — "10110" in blocky pixel numerals
function BinarySprite({ fill }: { fill: string }) {
  // Digit pixel maps: each digit is 3-wide × 5-tall
  const DIGITS: Record<string, [number, number][]> = {
    '1': [[1,0],[1,1],[1,2],[1,3],[1,4]],
    '0': [[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[0,4],[1,4],[2,4]],
  }
  const str = '10110'
  const cellSize = 2
  const digitW = 3 * cellSize
  const gap = cellSize
  return (
    <svg viewBox={`0 0 ${str.length * (digitW + gap)} ${5 * cellSize}`}
         width={str.length * (digitW + gap)} height={5 * cellSize}>
      {str.split('').map((ch, di) =>
        (DIGITS[ch] || []).map(([px, py], pi) => (
          <rect
            key={`${di}-${pi}`}
            x={di * (digitW + gap) + px * cellSize}
            y={py * cellSize}
            width={cellSize}
            height={cellSize}
            fill={fill}
          />
        ))
      )}
    </svg>
  )
}

// Doodle positions — spread across full canvas height to fill the void
// Avoids: left icons (<14%), right widgets (>78%), dock (>83%), topbar (<8%)

interface DoodlePos {
  top: string
  left: string
  floatClass: 'float-a' | 'float-b' | 'float-c'
  delay: string
  duration: string
  component: 'curly' | 'tag' | 'git' | 'cursor' | 'binary'
}

const DOODLE_POSITIONS: DoodlePos[] = [
  { top: '10%', left: '20%', floatClass: 'float-b', delay: '0s',   duration: '7s',   component: 'curly'  },
  { top: '28%', left: '65%', floatClass: 'float-a', delay: '1.4s', duration: '6.5s', component: 'tag'    },
  { top: '46%', left: '32%', floatClass: 'float-c', delay: '2.8s', duration: '5.8s', component: 'binary' },
  { top: '60%', left: '72%', floatClass: 'float-a', delay: '0.7s', duration: '6s',   component: 'cursor' },
  { top: '74%', left: '47%', floatClass: 'float-b', delay: '3.5s', duration: '8s',   component: 'git'    },
  { top: '16%', left: '52%', floatClass: 'float-c', delay: '2.1s', duration: '6.2s', component: 'binary' },
]

function PixelDoodles({ theme }: { theme: Theme }) {
  const cfg = THEME_CONFIG[theme]
  const fill = cfg.doodleColor
  const opacity = cfg.doodleOpacity

  const sprites: Record<DoodlePos['component'], React.ReactNode> = {
    curly:  <CurlyBraceSprite fill={fill} />,
    tag:    <TagSprite fill={fill} />,
    git:    <GitBranchSprite fill={fill} />,
    cursor: <CursorSprite fill={fill} />,
    binary: <BinarySprite fill={fill} />,
  }

  return (
    <>
      {DOODLE_POSITIONS.map((d, i) => (
        <div
          key={i}
          className={d.floatClass}
          style={{
            position: 'absolute',
            top: d.top,
            left: d.left,
            opacity,
            pointerEvents: 'none',
            userSelect: 'none',
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        >
          {sprites[d.component]}
        </div>
      ))}
    </>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function DesktopBackground() {
  const theme = useCurrentTheme()
  const cfg = THEME_CONFIG[theme]
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nearLitSet = useFlicker(TOTAL_NEAR)
  const farLitSet  = useFlicker(TOTAL_FAR)

  // Parallax refs — direct DOM mutation, no state, no re-renders
  const farWallRef    = useRef<HTMLDivElement>(null)
  const nearWallRef   = useRef<HTMLDivElement>(null)
  const doodleRef     = useRef<HTMLDivElement>(null)
  const rafRef        = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const nx = (e.clientX - cx) / cx  // –1 … +1
      const ny = (e.clientY - cy) / cy

      // Far buildings — barely move (depth illusion: distant = slow)
      if (farWallRef.current) {
        farWallRef.current.style.transform = `translate(${nx * -3}px, ${ny * -2}px)`
      }
      // Near buildings — move slightly more
      if (nearWallRef.current) {
        nearWallRef.current.style.transform = `translate(${nx * -6}px, ${ny * -3}px)`
      }
      // Doodles — move most (closest layer)
      if (doodleRef.current) {
        doodleRef.current.style.transform = `translate(${nx * -12}px, ${ny * -8}px)`
      }
    })
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove])

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* Matrix Rain Easter Egg (only active in Matrix theme) */}
      {theme === 'matrix' && <MatrixRain />}

      {/* Layer 0 — horizon wordmark behind buildings */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg
          viewBox="0 -80 1000 280"
          width="100%"
          height="280"
          preserveAspectRatio="xMidYMax meet"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents: 'none',
            transform: isMobile ? 'scale(1.65)' : 'none',
            transformOrigin: 'bottom center',
          }}
        >
          <HorizonWordmark theme={theme} />
        </svg>
      </div>

      {/* Layer 1a — far skyline (slower parallax) */}
      <div
        ref={farWallRef}
        style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
      >
        <SkylineLayer
          buildings={FAR_BUILDINGS}
          dots={FAR_DOTS_ALL}
          litSet={farLitSet}
          fills={cfg.farFill}
          windowFill={cfg.windowFill}
          cloudFill={cfg.cloudFill}
          showClouds={true}
          opacity={cfg.skylineOpacity * 0.65}
          isMobile={isMobile}
        />
      </div>

      {/* Layer 1b — near skyline (faster parallax) */}
      <div
        ref={nearWallRef}
        style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
      >
        <SkylineLayer
          buildings={NEAR_BUILDINGS}
          dots={NEAR_DOTS_ALL}
          litSet={nearLitSet}
          fills={cfg.nearFill}
          windowFill={cfg.windowFill}
          cloudFill={cfg.cloudFill}
          showClouds={false}
          opacity={cfg.skylineOpacity}
          isMobile={isMobile}
        />
      </div>

      {/* Layer 2 — pixel-art doodle sprites */}
      <div
        ref={doodleRef}
        style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
      >
        <PixelDoodles theme={theme} />
      </div>
    </div>
  )
}
