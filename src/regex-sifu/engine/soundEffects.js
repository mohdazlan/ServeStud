/**
 * Synthetic Cyber Sound Engine using Web Audio API
 * Strictly muted by default, zero network requests, user-initiated toggle.
 */

class SoundEngine {
  constructor() {
    this.ctx = null
    this.enabled = false
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('regex_sifu_sound') === 'true'
    }
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.ctx = new AudioContext()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggleSound(forceState) {
    this.enabled = forceState !== undefined ? forceState : !this.enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('regex_sifu_sound', this.enabled ? 'true' : 'false')
    }
    if (this.enabled) {
      this.init()
      this.playBlip(520, 0.05)
    }
    return this.enabled
  }

  isEnabled() {
    return this.enabled
  }

  playBlip(freq = 440, duration = 0.06, type = 'sine') {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch {
      // Audio autoplay policy or device failure handled silently
    }
  }

  playMatchSuccess() {
    if (!this.enabled) return
    this.playBlip(587.33, 0.08, 'sine') // D5
    setTimeout(() => this.playBlip(880, 0.12, 'sine'), 60) // A5
  }

  playMatchFail() {
    if (!this.enabled) return
    this.playBlip(220, 0.1, 'triangle') // A3
  }

  playCyberBoot() {
    if (!this.enabled) return
    this.playBlip(320, 0.04, 'square')
    setTimeout(() => this.playBlip(640, 0.04, 'square'), 80)
    setTimeout(() => this.playBlip(1280, 0.06, 'sine'), 160)
  }
}

export const soundEffects = new SoundEngine()
