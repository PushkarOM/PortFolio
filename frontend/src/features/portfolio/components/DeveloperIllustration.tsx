export default function DeveloperIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Floating tech badges */}
      <div className="float-a" style={{ position: 'absolute', top: '8%', left: '8%', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#4338CA', fontWeight: 500, zIndex: 2 }}>
        Python 🐍
      </div>
      <div className="float-b" style={{ position: 'absolute', top: '12%', right: '6%', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#15803D', fontWeight: 500, zIndex: 2 }}>
        PyTorch 🔥
      </div>
      <div className="float-c" style={{ position: 'absolute', bottom: '18%', left: '4%', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#C2410C', fontWeight: 500, zIndex: 2 }}>
        {'</>'}  React
      </div>
      <div className="float-a" style={{ position: 'absolute', bottom: '22%', right: '5%', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#0369A1', fontWeight: 500, zIndex: 2 }}>
        🐳 Docker
      </div>
      <div className="float-b" style={{ position: 'absolute', top: '38%', left: '2%', background: '#FDF4FF', border: '1px solid #E9D5FF', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#7E22CE', fontWeight: 500, zIndex: 2 }}>
        {'{ }'}
      </div>
      <div className="float-c" style={{ position: 'absolute', top: '42%', right: '2%', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#065F46', fontWeight: 500, zIndex: 2 }}>
        ⚡ GPU
      </div>

      {/* Small floating stars */}
      {[
        { top: '25%', left: '20%', size: 10, color: '#F59E0B', delay: '0.5s' },
        { top: '60%', left: '15%', size: 8, color: '#8B5CF6', delay: '1.2s' },
        { top: '20%', right: '20%', size: 12, color: '#22D3EE', delay: '0.8s' },
        { top: '70%', right: '18%', size: 9, color: '#34D399', delay: '1.5s' },
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

      {/* Main illustration — cat at desk, replaces the old hand-drawn SVG figure */}
      <img
        src="developer1.png" 
        alt="Cartoon cat sitting at a desk coding, with a monitor and glowing PC tower"
        style={{
          position: 'relative',
          zIndex: 0,
          width: '90%',
          maxWidth: 320,
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
