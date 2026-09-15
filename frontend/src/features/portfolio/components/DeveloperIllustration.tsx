interface Props {
  isMobile?: boolean
}

export default function DeveloperIllustration({ isMobile }: Props) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: isMobile ? 'auto' : '100%',
      padding: isMobile ? '12px 0 8px 0' : 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Floating tech badges */}
      <div className="float-a" style={{ position: 'absolute', top: isMobile ? '2%' : '8%', left: isMobile ? '2%' : '8%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '3px 7px', fontSize: isMobile ? 10 : 11, fontFamily: 'var(--font-mono)', color: 'var(--blue-bright)', fontWeight: 500, zIndex: 2 }}>
        Python 🐍
      </div>
      <div className="float-b" style={{ position: 'absolute', top: isMobile ? '4%' : '12%', right: isMobile ? '2%' : '6%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '3px 7px', fontSize: isMobile ? 10 : 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 500, zIndex: 2 }}>
        PyTorch 🔥
      </div>
      <div className="float-c" style={{ position: 'absolute', bottom: isMobile ? '6%' : '18%', left: isMobile ? '1%' : '4%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '3px 7px', fontSize: isMobile ? 10 : 11, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)', fontWeight: 500, zIndex: 2 }}>
        {'</>'} React
      </div>
      <div className="float-a" style={{ position: 'absolute', bottom: isMobile ? '8%' : '22%', right: isMobile ? '1%' : '5%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '3px 7px', fontSize: isMobile ? 10 : 11, fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontWeight: 500, zIndex: 2 }}>
        🐳 Docker
      </div>
      {!isMobile && (
        <>
          <div className="float-b" style={{ position: 'absolute', top: '38%', left: '2%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 500, zIndex: 2 }}>
            {'{ }'}
          </div>
          <div className="float-c" style={{ position: 'absolute', top: '42%', right: '2%', background: 'var(--bg-window-alt)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)', fontWeight: 500, zIndex: 2 }}>
            ⚡ GPU
          </div>
        </>
      )}

      {/* Small floating stars */}
      {[
        { top: '25%', left: '20%', size: 10, color: 'var(--blue-bright)', delay: '0.5s' },
        { top: '60%', left: '15%', size: 8, color: 'var(--blue-sky)', delay: '1.2s' },
        { top: '20%', right: '20%', size: 12, color: 'var(--blue-primary)', delay: '0.8s' },
        { top: '70%', right: '18%', size: 9, color: 'var(--blue-deep)', delay: '1.5s' },
      ].map((star, i) => (
        <div key={i} className="float-a" style={{
          position: 'absolute',
          top: star.top, left: (star as any).left, right: (star as any).right,
          width: star.size, height: star.size,
          animationDelay: star.delay,
          zIndex: 2,
        }}>
          <svg viewBox="0 0 12 12" fill={star.color} width={star.size} height={star.size}>
            <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z" />
          </svg>
        </div>
      ))}

      {/* Main illustration — Pushkar pixel art avatar */}
      <img
        src="developer1.png" 
        alt="Pixel-art portrait illustration of Pushkar coding at a desk"
        className="img-pixelated"
        style={{
          position: 'relative',
          zIndex: 0,
          width: isMobile ? '80%' : '90%',
          maxWidth: isMobile ? 200 : 320,
          height: 'auto',
          aspectRatio: '1 / 1',
          objectFit: 'contain',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  )
}
