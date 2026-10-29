// src/lib/soundEngine.ts — Zero-Dependency Procedural Web Audio API Synthesizer
import { useThemeStore } from '../store/themeStore';

class AtelierSoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!useThemeStore.getState().soundEnabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Crisp tailor's shear snip for size selection, filter pills, and button clicks */
  public playShearSnip() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // High-frequency metallic transient
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1850, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.035);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  /** Tactile drafting-paper rustle for opening CartDrawer, WishlistDrawer, or SizeGuideModal */
  public playPaperRustle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.09;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(1.8, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  /** Warm jacquard loom harmonic chord when adding a garment to bag or completing checkout */
  public playLoomChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [329.63, 440.0, 659.25]; // E4 - A4 - E5 open fifth weave chord

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.025);

      gain.gain.setValueAtTime(0.045, now + idx * 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38 + idx * 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.025);
      osc.stop(now + 0.45);
    });
  }

  public playTick(_freq = 180, _duration = 0.025) {
    this.playShearSnip();
  }

  public playChime() {
    this.playLoomChime();
  }

  public toggle(): boolean {
    useThemeStore.getState().toggleSound();
    const enabled = useThemeStore.getState().soundEnabled;
    if (enabled) this.playLoomChime();
    return enabled;
  }

  public get enabled(): boolean {
    return useThemeStore.getState().soundEnabled;
  }
}

export const soundEngine = new AtelierSoundEngine();
export default soundEngine;
