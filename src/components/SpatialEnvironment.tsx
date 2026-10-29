// src/components/SpatialEnvironment.tsx
import React, { useEffect, useState, useRef } from 'react';

// Procedural Web-Audio Synthesizer for Luxury Tactile Clicks
class AtelierSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('atelier_sound');
      this.enabled = saved !== null ? saved === 'true' : true;
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playTick(freq = 180, duration = 0.025) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignore audio restrictions
    }
  }

  public playChime() {
    this.playTick(520, 0.06);
    setTimeout(() => this.playTick(780, 0.08), 45);
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('atelier_sound', String(this.enabled));
    if (this.enabled) this.playChime();
    return this.enabled;
  }
}

export const soundEngine = new AtelierSoundEngine();

export const SpatialEnvironment: React.FC = () => {
  const [cursor, setCursor] = useState({ x: -100, y: -100, hovering: false, label: '' });
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const target = e.target as HTMLElement | null;
        const interactive = target?.closest('a, button, input, select, [data-cursor]');
        const customLabel = interactive?.getAttribute('data-cursor') || '';
        setCursor({
          x: e.clientX,
          y: e.clientY,
          hovering: Boolean(interactive),
          label: customLabel,
        });
      });
    };

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a')) {
        soundEngine.playTick(240, 0.03);
      }
    };

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, pct)));
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      {/* Top Laser Telemetry Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent">
        <div
          className="h-full bg-[var(--accent-signal)] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Ambient Cursor-Reactive Aura Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 hidden lg:block"
        style={{
          background: `radial-gradient(600px circle at ${cursor.x}px ${cursor.y}px, var(--aura-glow), transparent 70%)`,
        }}
      />

      {/* Precision Magnetic Cursor Ring (Desktop Only) */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-50 hidden xl:flex items-center justify-center transition-transform duration-150 ease-out"
        style={{
          transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <div
          className={`rounded-full flex items-center justify-center transition-all duration-200 ${
            cursor.label
              ? 'w-16 h-16 bg-[var(--accent-signal)] text-white shadow-xl scale-100'
              : cursor.hovering
              ? 'w-10 h-10 border-2 border-[var(--accent-signal)] bg-[var(--accent-signal)]/10 scale-110'
              : 'w-5 h-5 border border-[var(--ink-primary)]/40 scale-100'
          }`}
        >
          {cursor.label && (
            <span className="font-mono-tech text-[9px] font-bold uppercase tracking-wider">
              {cursor.label}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default SpatialEnvironment;
