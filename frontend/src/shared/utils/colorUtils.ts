/**
 * Maps legacy hex colors to CSS theme variables so badges, progress bars, dots,
 * and skill categories automatically adapt to the active theme (Aurora, Midnight, Retro, Matrix).
 */
export function getThemeColor(color?: string): string {
  if (!color) return 'var(--blue-primary)'
  if (color.startsWith('var(')) return color

  const normalized = color.toLowerCase().trim()
  const map: Record<string, string> = {
    '#2563eb': 'var(--blue-primary)',
    '#3b82f6': 'var(--blue-bright)',
    '#60a5fa': 'var(--blue-sky)',
    '#1e3a8a': 'var(--blue-deep)',
    '#38bdf8': 'var(--cyan)',
    '#f59e0b': 'var(--amber)',
    '#d97706': 'var(--amber)',
    '#8b5cf6': 'var(--purple)',
    '#10b981': 'var(--mint)',
    '#34d399': 'var(--mint)',
    '#475569': 'var(--blue-sky)',
  }

  return map[normalized] || color
}
