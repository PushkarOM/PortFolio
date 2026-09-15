/**
 * soundService.ts — Central Sound Effects & Background Music Manager.
 *
 * Features:
 *   - UI Sound Effects: Dock click blips, Window Open pitch sweep, Window Close reverse blip.
 *   - Background Music Switcher: 3 distinct looping synth/chiptune tracks + Off option.
 *   - Web Audio API synthesizer engine — 0 network latencies, 0 missing file errors.
 *   - Strict Autoplay Compliance: Audio Context remains suspended until user explicitly interacts.
 *   - LocalStorage Persistence: Mute state, volume, and selected track persist across reloads.
 */

export interface TrackInfo {
  id: number
  name: string
  genre: string
}

export const MUSIC_TRACKS: TrackInfo[] = [
  { id: 0, name: 'Pixel Chill', genre: 'Lo-Fi Chiptune' },
  { id: 1, name: 'Arcade Quest', genre: 'Retro 8-Bit' },
  { id: 2, name: 'Cyber Ambient', genre: 'Midnight Synth' },
]

class SoundService {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false
  private volume: number = 0.5
  private activeTrackId: number = -1 // -1 = Off by default (hard constraint: no autoplay)
  private musicLoopInterval: number | null = null
  private musicStep: number = 0

  constructor() {
    this.loadSettings()
  }

  /**
   * Load stored settings from localStorage.
   */
  private loadSettings() {
    if (typeof window === 'undefined') return

    const storedMute = localStorage.getItem('pushkar_os_sound_muted')
    if (storedMute !== null) {
      this.isMuted = storedMute === 'true'
    }

    const storedVol = localStorage.getItem('pushkar_os_sound_volume')
    if (storedVol !== null) {
      this.volume = Math.max(0, Math.min(1, parseFloat(storedVol)))
    }

    const storedTrack = localStorage.getItem('pushkar_os_sound_track')
    if (storedTrack !== null) {
      this.activeTrackId = parseInt(storedTrack, 10)
    }

    if (this.activeTrackId >= 0 && !this.isMuted) {
      this.setupFirstInteractionListener()
    }
  }

  /**
   * Resumes audio context and starts music loop on first user interaction after reload.
   */
  private setupFirstInteractionListener() {
    if (typeof window === 'undefined') return

    const handleFirstInteraction = () => {
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
      window.removeEventListener('click', handleFirstInteraction)

      if (this.activeTrackId >= 0 && !this.isMuted) {
        this.getContext()
        this.startMusicLoop()
      }
    }

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true })
    window.addEventListener('keydown', handleFirstInteraction, { once: true, passive: true })
    window.addEventListener('click', handleFirstInteraction, { once: true, passive: true })
  }

  /**
   * Lazy-initialize AudioContext after a user gesture.
   */
  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    if (this.activeTrackId >= 0 && !this.isMuted && this.musicLoopInterval === null) {
      this.startMusicLoop()
    }
    return this.ctx
  }

  // ─── LocalStorage Sync ──────────────────────────────────────────────
  public getMuted(): boolean {
    return this.isMuted
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
    if (typeof window !== 'undefined') {
      localStorage.setItem('pushkar_os_sound_muted', String(muted))
    }
    if (muted) {
      this.stopMusicLoop()
    } else if (this.activeTrackId >= 0) {
      this.startMusicLoop()
    }
  }

  public getVolume(): number {
    return this.volume
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
    if (typeof window !== 'undefined') {
      localStorage.setItem('pushkar_os_sound_volume', String(this.volume))
    }
  }

  public getActiveTrack(): number {
    return this.activeTrackId
  }

  public setActiveTrack(trackId: number) {
    this.activeTrackId = trackId
    if (typeof window !== 'undefined') {
      localStorage.setItem('pushkar_os_sound_track', String(trackId))
    }
    if (trackId === -1 || this.isMuted) {
      this.stopMusicLoop()
    } else {
      this.getContext() // Ensure ctx active on user click
      this.startMusicLoop()
    }
  }

  // ─── Sound Effects ──────────────────────────────────────────────────

  /**
   * Short retro blip sound on dock icon / button click.
   */
  public playClick() {
    if (this.isMuted || this.volume <= 0) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime) // A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.02) // E6

      gain.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.035)
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Assembling pitch sweep sound on window open.
   */
  public playWindowOpen() {
    if (this.isMuted || this.volume <= 0) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.07)

      gain.gain.setValueAtTime(this.volume * 0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Reverse pitch sweep blip sound on window close.
   */
  public playWindowClose() {
    if (this.isMuted || this.volume <= 0) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.06)

      gain.gain.setValueAtTime(this.volume * 0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.07)
    } catch {
      // AudioContext unavailable
    }
  }

  // ─── Background Music Synthesizer Loop ─────────────────────────────

  private startMusicLoop() {
    this.stopMusicLoop()
    if (this.activeTrackId === -1 || this.isMuted) return

    this.musicStep = 0
    const intervalMs = this.activeTrackId === 1 ? 160 : (this.activeTrackId === 0 ? 240 : 320)

    this.musicLoopInterval = window.setInterval(() => {
      this.playMusicStep()
    }, intervalMs)
  }

  private stopMusicLoop() {
    if (this.musicLoopInterval !== null) {
      clearInterval(this.musicLoopInterval)
      this.musicLoopInterval = null
    }
  }

  private playMusicStep() {
    if (this.isMuted || this.volume <= 0 || this.activeTrackId === -1) return
    const ctx = this.getContext()
    if (!ctx) return

    const trackId = this.activeTrackId
    const step = this.musicStep
    this.musicStep = (this.musicStep + 1) % 32

    try {
      if (trackId === 0) {
        // Track 0: Pixel Chill (Lo-Fi Arpeggiated 7th Chords)
        const scale = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99, 987.77] // C Major 7th
        const noteIdx = (step * 3 + (step % 5)) % scale.length
        const freq = scale[noteIdx]

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        const noteVol = this.volume * 0.05
        gain.gain.setValueAtTime(noteVol, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + 0.22)

      } else if (trackId === 1) {
        // Track 1: Arcade Quest (Retro 8-Bit Pulse Melody)
        const scale = [329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99] // E Minor Pentatonic
        const pattern = [0, 2, 4, 3, 5, 2, 6, 4, 1, 3, 5, 2, 4, 6, 3, 1]
        const freq = scale[pattern[step % pattern.length]]

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'square'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        const noteVol = this.volume * 0.035
        gain.gain.setValueAtTime(noteVol, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + 0.14)

      } else if (trackId === 2) {
        // Track 2: Cyber Ambient (Midnight Synth Swells)
        if (step % 4 === 0) {
          const chords = [
            [220.00, 261.63, 329.63], // A Minor
            [174.61, 220.00, 261.63], // F Major
            [196.00, 246.94, 293.66], // G Major
            [164.81, 196.00, 246.94], // E Minor
          ]
          const chord = chords[Math.floor(step / 8) % chords.length]

          chord.forEach(freq => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(freq, ctx.currentTime)

            const noteVol = this.volume * 0.025
            gain.gain.setValueAtTime(0.001, ctx.currentTime)
            gain.gain.linearRampToValueAtTime(noteVol, ctx.currentTime + 0.3)
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2)

            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.start()
            osc.stop(ctx.currentTime + 1.2)
          })
        }
      }
    } catch {
      // AudioContext unavailable
    }
  }
}

export const soundService = new SoundService()
