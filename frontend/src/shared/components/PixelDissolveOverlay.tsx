import { useMemo, useState, useEffect } from 'react'
import { usePresence } from 'framer-motion'

const COLS = 10
const ROWS = 8

const PIXEL_COLOR_PALETTE = [
  'var(--bg-window)',
  'var(--bg-window)',
  'var(--bg-window-alt)',
  'color-mix(in srgb, var(--blue-bright) 22%, var(--bg-window))',
  'color-mix(in srgb, var(--blue-primary) 15%, var(--bg-window))',
  'color-mix(in srgb, var(--cyan) 25%, var(--bg-window))',
  'color-mix(in srgb, var(--blue-sky) 28%, var(--bg-window))',
]

export default function PixelDissolveOverlay() {
  const [isPresent] = usePresence()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Generate stable randomized delays and colors for 80 blocks (0s to 0.22s)
  const blocksData = useMemo(() => {
    return Array.from({ length: COLS * ROWS }, () => ({
      delay: (Math.random() * 0.22).toFixed(3),
      color: PIXEL_COLOR_PALETTE[Math.floor(Math.random() * PIXEL_COLOR_PALETTE.length)],
    }))
  }, [])

  if (prefersReducedMotion) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9999,
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        pointerEvents: 'none',
        overflow: 'hidden',
        borderRadius: 'inherit',
      }}
    >
      {blocksData.map(({ delay, color }, idx) => (
        <div
          key={idx}
          className={isPresent ? 'pixel-block-open' : 'pixel-block-close'}
          style={{
            background: color,
            margin: '-0.5px', // prevent seams between grid tiles
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  )
}
