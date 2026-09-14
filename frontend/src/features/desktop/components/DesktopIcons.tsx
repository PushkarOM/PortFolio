interface IconDef {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

interface Props {
  onOpen: (id: string) => void
  activeSection?: string
}

function FolderIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
      <path d="M2 6C2 4.9 2.9 4 4 4H12L14 7H28C29.1 7 30 7.9 30 9V24C30 25.1 29.1 26 28 26H4C2.9 26 2 25.1 2 24V6Z"
        fill={color} />
      <path d="M2 10H30V24C30 25.1 29.1 26 28 26H4C2.9 26 2 25.1 2 24V10Z"
        fill={color} opacity="0.8" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
      <rect x="2" y="3" width="28" height="22" rx="4" fill="#1E2333" />
      <rect x="2" y="3" width="28" height="6" rx="4" fill="#0D1117" />
      <circle cx="8" cy="6" r="1.5" fill="#FF5F57" />
      <circle cx="13" cy="6" r="1.5" fill="#FFBD2E" />
      <circle cx="18" cy="6" r="1.5" fill="#28CA42" />
      <path d="M7 15L12 18.5L7 22" stroke="var(--text-terminal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 22H22" stroke="var(--text-terminal)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="28" height="30" viewBox="0 0 28 30" fill="none">
      <rect x="4" y="8" width="20" height="20" rx="3" fill="var(--text-muted)" />
      <rect x="4" y="8" width="20" height="20" rx="3" fill="var(--text-muted)" opacity="0.3" />
      <path d="M2 8H26M10 4H18M11 14V22M17 14V22" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function DocIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="32" viewBox="0 0 26 32" fill="none">
      <path d="M4 1H17L25 9V29C25 30.1 24.1 31 23 31H4C2.9 31 2 30.1 2 29V3C2 1.9 2.9 1 4 1Z" fill={color} />
      <path d="M17 1L25 9H17V1Z" fill="rgba(0,0,0,0.2)" />
      <path d="M7 15H19M7 19H16M7 23H13" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function DesktopIcons({ onOpen }: Props) {
  const icons: IconDef[] = [
    {
      id: 'Terminal',
      label: 'Terminal',
      icon: <TerminalIcon />,
      color: 'var(--bg-topbar)',
    },
    {
      id: 'Projects',
      label: 'Projects',
      icon: <FolderIcon color="var(--blue-bright)" />,
      color: 'var(--blue-bright)',
    },
    {
      id: 'Experience',
      label: 'Experience',
      icon: <FolderIcon color="var(--purple)" />,
      color: 'var(--purple)',
    },
    {
      id: 'Skills',
      label: 'Skills',
      icon: <FolderIcon color="var(--mint)" />,
      color: 'var(--mint)',
    },
    {
      id: 'Resume',
      label: 'resume.txt',
      icon: <DocIcon color="var(--amber)" />,
      color: 'var(--amber)',
    },
    {
      id: 'Contact',
      label: 'Contact',
      icon: <FolderIcon color="var(--cyan)" />,
      color: 'var(--cyan)',
    },
    {
      id: 'Trash',
      label: 'Trash',
      icon: <TrashIcon />,
      color: '#64748B',
    },
  ]

  return (
    <div style={{
      width: 72,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 16,
      paddingBottom: 16,
      gap: 4,
      flexShrink: 0,
    }}>
      {icons.map(icon => (
        <button
          key={icon.id}
          className="desktop-icon"
          onClick={() => onOpen(icon.id)}
          title={icon.label}
          style={{
            background: 'none',
            border: 'none',
            width: 60,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>{icon.icon}</div>
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: 56,
            wordBreak: 'break-all',
            opacity: 0.85,
          }}>
            {icon.label}
          </span>
        </button>
      ))}
    </div>
  )
}
