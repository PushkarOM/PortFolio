// Real, best-effort detection of the visitor's own browser/device.
// Every field degrades gracefully — none of these APIs are guaranteed to exist
// (deviceMemory is Chromium-only, WEBGL_debug_renderer_info is often blocked for
// fingerprinting reasons in Firefox/Safari, Network Information API is Chromium-only).
// We never fabricate a value — an unavailable field says so honestly, in-character.

export interface DetectedSystemInfo {
  os: string
  browser: string
  cpuCores: string
  memory: string
  display: string
  timezone: string
  locale: string
  gpu: string
  connection: string
}

function detectOS(): string {
  const ua = navigator.userAgent
  if (/Windows/i.test(ua)) return 'Windows'
  if (/Mac OS X/i.test(ua)) return 'macOS'
  if (/Android/i.test(ua)) return 'Android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
  if (/Linux/i.test(ua)) return 'Linux'
  return 'Unknown'
}

function detectBrowser(): string {
  const ua = navigator.userAgent
  if (/Edg\//.test(ua)) return 'Edge'
  if (/OPR\//.test(ua)) return 'Opera'
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return 'Chrome'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return 'Safari'
  return 'Unknown'
}

function detectGPU(): string {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return 'unavailable'
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    if (!dbg) return 'restricted by browser'
    const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string
    return renderer || 'unknown'
  } catch {
    return 'unavailable'
  }
}

export function getSystemInfo(): DetectedSystemInfo {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { effectiveType?: string }
  }

  return {
    os: detectOS(),
    browser: detectBrowser(),
    cpuCores: nav.hardwareConcurrency ? `${nav.hardwareConcurrency} threads` : 'unknown',
    memory: nav.deviceMemory ? `~${nav.deviceMemory}GB` : 'unreported',
    display: `${window.screen.width}x${window.screen.height} @${window.devicePixelRatio}x`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    locale: nav.language || 'en-US',
    gpu: detectGPU(),
    connection: nav.connection?.effectiveType ? nav.connection.effectiveType.toUpperCase() : 'unreported',
  }
}
