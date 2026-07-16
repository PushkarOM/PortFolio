export default function DeveloperIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Floating tech badges */}
      <div className="float-a" style={{ position: 'absolute', top: '8%', left: '8%', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#4338CA', fontWeight: 500 }}>
        Python 🐍
      </div>
      <div className="float-b" style={{ position: 'absolute', top: '12%', right: '6%', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#15803D', fontWeight: 500 }}>
        PyTorch 🔥
      </div>
      <div className="float-c" style={{ position: 'absolute', bottom: '18%', left: '4%', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#C2410C', fontWeight: 500 }}>
        {'</>'}  React
      </div>
      <div className="float-a" style={{ position: 'absolute', bottom: '22%', right: '5%', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#0369A1', fontWeight: 500 }}>
        🐳 Docker
      </div>
      <div className="float-b" style={{ position: 'absolute', top: '38%', left: '2%', background: '#FDF4FF', border: '1px solid #E9D5FF', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#7E22CE', fontWeight: 500 }}>
        {'{ }'}
      </div>
      <div className="float-c" style={{ position: 'absolute', top: '42%', right: '2%', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#065F46', fontWeight: 500 }}>
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
        }}>
          <svg viewBox="0 0 12 12" fill={star.color} width={star.size} height={star.size}>
            <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z" />
          </svg>
        </div>
      ))}

      {/* Main SVG illustration */}
      <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '85%', maxWidth: 260, height: 'auto' }}>

        {/* Desk surface */}
        <ellipse cx="140" cy="218" rx="110" ry="14" fill="#D4C8A4" opacity="0.6" />
        <rect x="36" y="190" width="208" height="30" rx="4" fill="#C4B896" />
        <rect x="36" y="188" width="208" height="6" rx="3" fill="#D4C8A4" />

        {/* Laptop base */}
        <rect x="72" y="155" width="120" height="80" rx="4" fill="#2D3748" />
        <rect x="76" y="158" width="112" height="72" rx="3" fill="#1A202C" />
        {/* Screen */}
        <rect x="80" y="162" width="104" height="64" rx="2" fill="#0D1117" />
        {/* Code on screen */}
        <rect x="86" y="168" width="45" height="3" rx="1.5" fill="#3B82F6" opacity="0.8" />
        <rect x="86" y="174" width="62" height="2.5" rx="1.25" fill="#34D399" opacity="0.7" />
        <rect x="90" y="179" width="38" height="2.5" rx="1.25" fill="#8B5CF6" opacity="0.7" />
        <rect x="90" y="184" width="55" height="2.5" rx="1.25" fill="#F59E0B" opacity="0.7" />
        <rect x="86" y="189" width="42" height="2.5" rx="1.25" fill="#34D399" opacity="0.7" />
        <rect x="90" y="194" width="30" height="2.5" rx="1.25" fill="#64748B" opacity="0.7" />
        <rect x="152" y="199" width="6" height="6" rx="1" fill="#34D399" opacity="0.9" />

        {/* Laptop keyboard */}
        <rect x="72" y="235" width="120" height="14" rx="3" fill="#374151" />
        {/* Keys */}
        {Array.from({ length: 11 }).map((_, i) => (
          <rect key={i} x={78 + i * 10} y={238} width="7" height="5" rx="1" fill="#4B5563" />
        ))}

        {/* Stickers on laptop */}
        <rect x="158" y="202" width="22" height="12" rx="3" fill="#10B981" opacity="0.9" />
        <text x="160" y="211" fontSize="7" fontFamily="monospace" fill="white" fontWeight="bold">Linux</text>
        <rect x="158" y="216" width="22" height="12" rx="3" fill="#2563EB" opacity="0.9" />
        <text x="160" y="225" fontSize="7" fontFamily="monospace" fill="white" fontWeight="bold">Git</text>

        {/* Chair back */}
        <rect x="106" y="82" width="68" height="94" rx="10" fill="#374151" />
        <rect x="112" y="88" width="56" height="78" rx="7" fill="#4B5563" />

        {/* Body / green hoodie */}
        <rect x="104" y="130" width="72" height="70" rx="12" fill="#059669" />
        {/* Hoodie details */}
        <path d="M140 130 L140 175" stroke="#047857" strokeWidth="2" strokeDasharray="0" />
        <rect x="116" y="148" width="24" height="16" rx="4" fill="#047857" opacity="0.7" />
        {/* Sleeves */}
        <path d="M104 148 Q86 155 84 170 L92 172 Q96 158 112 152" fill="#059669" />
        <path d="M176 148 Q194 155 196 170 L188 172 Q184 158 168 152" fill="#059669" />

        {/* Hands */}
        <ellipse cx="88" cy="174" rx="9" ry="7" fill="#FDDBB4" />
        <ellipse cx="192" cy="174" rx="9" ry="7" fill="#FDDBB4" />

        {/* Neck */}
        <rect x="132" y="110" width="16" height="24" rx="4" fill="#FDDBB4" />

        {/* Head */}
        <ellipse cx="140" cy="92" rx="30" ry="32" fill="#FDDBB4" />

        {/* Hair */}
        <path d="M112 82 Q116 58 140 58 Q164 58 168 82 Q162 72 140 70 Q118 72 112 82Z" fill="#1A1A2E" />
        <path d="M110 78 Q108 70 112 66 Q110 74 114 80Z" fill="#1A1A2E" />
        <path d="M170 78 Q172 70 168 66 Q170 74 166 80Z" fill="#1A1A2E" />
        {/* Hair top detail */}
        <path d="M128 62 Q134 56 140 58 Q146 56 152 62" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Ears */}
        <ellipse cx="111" cy="92" rx="5" ry="7" fill="#FDDBB4" />
        <ellipse cx="169" cy="92" rx="5" ry="7" fill="#FDDBB4" />
        <ellipse cx="111" cy="92" rx="3" ry="5" fill="#F0C896" />
        <ellipse cx="169" cy="92" rx="3" ry="5" fill="#F0C896" />

        {/* Glasses */}
        <rect x="122" y="86" width="16" height="12" rx="6" stroke="#1A1A2E" strokeWidth="2" fill="rgba(147,197,253,0.3)" />
        <rect x="142" y="86" width="16" height="12" rx="6" stroke="#1A1A2E" strokeWidth="2" fill="rgba(147,197,253,0.3)" />
        <path d="M138 92 L142 92" stroke="#1A1A2E" strokeWidth="1.5" />
        <path d="M122 89 L116 87" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M158 89 L164 87" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />

        {/* Eyes */}
        <circle cx="130" cy="92" r="3" fill="#1A1A2E" />
        <circle cx="150" cy="92" r="3" fill="#1A1A2E" />
        <circle cx="131" cy="91" r="1" fill="white" />
        <circle cx="151" cy="91" r="1" fill="white" />

        {/* Smile */}
        <path d="M133 102 Q140 107 147 102" stroke="#D4956A" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <path d="M139 96 Q140 99 141 96" stroke="#D4956A" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Coffee mug */}
        <rect x="50" y="172" width="22" height="20" rx="4" fill="#F97316" />
        <path d="M72 178 Q80 178 80 183 Q80 188 72 188" stroke="#F97316" strokeWidth="2.5" fill="none" />
        <rect x="53" y="170" width="16" height="4" rx="2" fill="#FB923C" />
        {/* Steam */}
        <path d="M57 167 Q58 163 56 160" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M62 166 Q63 161 61 158" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* Plant */}
        <rect x="200" y="178" width="20" height="14" rx="4" fill="#92400E" />
        <rect x="202" y="176" width="16" height="4" rx="2" fill="#B45309" />
        {/* Plant leaves */}
        <path d="M210 175 Q204 160 196 158 Q202 162 208 170Z" fill="#059669" />
        <path d="M210 175 Q216 160 224 158 Q218 162 212 170Z" fill="#047857" />
        <path d="M210 172 Q208 158 204 152 Q208 158 210 165Z" fill="#10B981" />
        <path d="M210 172 Q212 158 216 152 Q212 158 210 165Z" fill="#059669" />

        {/* Notebook */}
        <rect x="196" y="184" width="36" height="28" rx="3" fill="#FEF3C7" />
        <rect x="196" y="184" width="6" height="28" rx="3" fill="#F59E0B" />
        {/* Notebook lines */}
        <path d="M205 191 L228 191M205 196 L224 196M205 201 L226 201M205 206 L220 206" stroke="#D4C8A4" strokeWidth="1" />

        {/* Mechanical keyboard */}
        <rect x="86" y="234" width="108" height="22" rx="4" fill="#2D3748" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={90 + i * 8} y={237} width="5" height="6" rx="1" fill={i === 5 ? '#3B82F6' : '#374151'} />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <rect key={i} x={93 + i * 8} y={246} width="5" height="6" rx="1" fill="#374151" />
        ))}
      </svg>
    </div>
  )
}
