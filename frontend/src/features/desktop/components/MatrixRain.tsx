import { useEffect, useRef } from 'react'

const CHARS = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ'

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const fontSize = 14
    let columns = Math.floor(width / fontSize)
    let drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50))

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      columns = Math.floor(width / fontSize)
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50))
    }

    window.addEventListener('resize', handleResize)

    let lastTime = 0
    const interval = 33 // ~30 fps tick for smooth retro matrix feel

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw)
      if (currentTime - lastTime < interval) return
      lastTime = currentTime

      // Translucent background sweep for trail effect
      ctx.fillStyle = 'rgba(0, 8, 0, 0.12)'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = '#00FF41'
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Draw bright head vs dim body
        ctx.fillStyle = Math.random() > 0.9 ? '#D0FFD0' : '#00FF41'
        ctx.fillText(char, x, y)

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    animationFrameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.35,
        zIndex: 0,
      }}
    />
  )
}
