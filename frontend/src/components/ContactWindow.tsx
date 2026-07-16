import React, { useState } from 'react'
import { portfolioApi } from '../services/api'

export default function ContactWindow() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-window-alt)',
    border: '1px solid var(--border-light)',
    borderRadius: 6,
    padding: '8px 11px',
    fontSize: 12,
    fontFamily: 'var(--font-body)',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  const links = [
    { label: 'GitHub', icon: '⌨️', value: 'github.com/PushkarOM', color: '#E2E8F0', href: 'https://github.com/PushkarOM' },
    { label: 'LinkedIn', icon: '💼', value: 'linkedin.com/in/pushkar-chaturvedi-a83778284', color: '#0A66C2', href: 'https://in.linkedin.com/in/pushkar-chaturvedi-a83778284' },
    { label: 'Email', icon: '📬', value: 'pushkarchaturvedi42@gmail.com', color: '#34D399', href: 'mailto:pushkarchaturvedi42@gmail.com' },
  ]

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return
    setSending(true)
    setError('')
    try {
      await portfolioApi.sendMessage(name, email, message)
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 260px', minHeight: 0, height: '100%', background: 'var(--bg-window)' }}>
      {/* Compose */}
      <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.03em' }}>
          Send a Message
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: '0 0 20px 0' }}>
          Let's build something great together.
        </p>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Message sent!</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>I'll reply within 24 hours.</div>
            <button onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }} style={{ marginTop: 16, background: 'var(--blue-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>
              Send Another
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Name</label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" disabled={sending} />
              </div>
              <div>
                <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Email</label>
                <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" disabled={sending} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Message</label>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: 'vertical' } as React.CSSProperties}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tell me about your project or opportunity..."
                disabled={sending}
              />
            </div>
            {error && (
              <div style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>
                ⚠ {error}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={sending || !name || !email || !message}
              style={{
                background: sending ? 'var(--text-muted)' : 'var(--blue-primary)',
                color: '#fff',
                border: 'none', borderRadius: 7, padding: '10px 20px',
                fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600,
                cursor: sending ? 'default' : 'pointer', alignSelf: 'flex-start',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!sending) e.currentTarget.style.background = 'var(--blue-bright)' }}
              onMouseLeave={e => { if (!sending) e.currentTarget.style.background = 'var(--blue-primary)' }}
            >
              {sending ? 'Sending...' : 'Send Message →'}
            </button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div style={{ borderLeft: '1px solid var(--border-light)', padding: '20px 16px', background: 'var(--bg-window-alt)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          Find me on
        </div>
        {links.map(link => (
          <div
            key={link.label}
            onClick={() => window.open(link.href, '_blank')}
            style={{
              background: 'var(--bg-window)',
              border: '1px solid var(--border-light)',
              borderRadius: 7, padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
          >
            <span style={{ fontSize: 18 }}>{link.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)' }}>{link.label}</div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{link.value}</div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 8, padding: '12px', background: 'var(--bg-window)', border: '1px solid var(--border-light)', borderRadius: 7 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--mint)', marginBottom: 6 }}>● Available for</div>
          {['Full-time roles', 'Freelance projects', 'Research collaboration', 'Open source'].map(item => (
            <div key={item} style={{ fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ color: 'var(--mint)', fontSize: 8 }}>▸</span>{item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
