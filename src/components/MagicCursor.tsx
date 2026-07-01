import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: number;
  size: number;
  spin: number;
  star: boolean;
};

/**
 * MagicCursor — a smiling fairy-dragon friend that follows the pointer,
 * flaps, bounces, glows, and scatters star dust on clicks and hovers.
 */
export function MagicCursor() {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    x: -140,
    y: -140,
    tx: -140,
    ty: -140,
    hover: false,
    down: false,
    particles: [] as Particle[],
    lastSpawn: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !cursor) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.documentElement.classList.add("magic-cursor-active");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const s = state.current;
    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]';

    const onMove = (e: PointerEvent) => {
      s.tx = e.clientX;
      s.ty = e.clientY;
      const el = e.target as HTMLElement | null;
      s.hover = !!el?.closest(interactiveSelector);
    };
    const onDown = () => {
      s.down = true;
      burst(s.tx, s.ty, 24);
    };
    const onUp = () => {
      s.down = false;
    };
    const onLeave = () => {
      s.tx = -180;
      s.ty = -180;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointerleave", onLeave);

    function addParticle(x: number, y: number, burstMode = false) {
      const a = Math.random() * Math.PI * 2;
      const sp = burstMode ? 1.4 + Math.random() * 4.2 : 0.35 + Math.random() * 1.1;
      s.particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - (burstMode ? 0.4 : 0.8),
        life: 0,
        max: burstMode ? 44 + Math.random() * 34 : 52 + Math.random() * 24,
        hue: s.hover ? 42 + Math.random() * 54 : 190 + Math.random() * 170,
        size: burstMode ? 2.2 + Math.random() * 3.5 : 1.4 + Math.random() * 2.4,
        spin: Math.random() * Math.PI,
        star: Math.random() > 0.35,
      });
    }

    function burst(x: number, y: number, n = 16) {
      for (let i = 0; i < n; i++) addParticle(x, y, true);
    }

    function drawStar(x: number, y: number, radius: number, rotation: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? radius : radius * 0.42;
        const angle = -Math.PI / 2 + (i * Math.PI) / 5;
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    let raf = 0;
    const tick = (t: number) => {
      s.x += (s.tx - s.x) * 0.2;
      s.y += (s.ty - s.y) * 0.2;

      const dx = s.tx - s.x;
      const dy = s.ty - s.y;
      const moving = dx * dx + dy * dy > 4;
      const tilt = Math.max(-12, Math.min(12, dx * 0.08));
      const scale = s.down ? 0.88 : s.hover ? 1.18 : 1;

      cursor.style.transform = `translate3d(${s.x - 18}px, ${s.y - 18}px, 0) rotate(${tilt}deg) scale(${scale})`;
      cursor.dataset.hover = s.hover ? "1" : "0";
      cursor.dataset.down = s.down ? "1" : "0";

      if (t - s.lastSpawn > (s.hover ? 16 : 26)) {
        s.lastSpawn = t;
        if (moving || s.hover) {
          addParticle(s.x + 18 + (Math.random() - 0.5) * 18, s.y + 18 + (Math.random() - 0.5) * 16);
        }
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.025;
        p.spin += 0.08;
        const k = 1 - p.life / p.max;
        if (k <= 0) {
          s.particles.splice(i, 1);
          continue;
        }
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 7);
        glow.addColorStop(0, `hsla(${p.hue}, 100%, 78%, ${0.95 * k})`);
        glow.addColorStop(1, `hsla(${p.hue}, 100%, 62%, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 86%, ${k})`;
        if (p.star) drawStar(p.x, p.y, p.size * (1 + k), p.spin);
        else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.8 + k), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("magic-cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[9998]" />
      <div
        ref={cursorRef}
        aria-hidden
        className="magic-cursor magic-cursor-character pointer-events-none fixed left-0 top-0 z-[9999] size-16 will-change-transform"
      >
        <svg viewBox="0 0 80 80" className="size-full overflow-visible" role="img">
          <defs>
            <radialGradient id="dragonBody" cx="38%" cy="28%" r="72%">
              <stop offset="0" stopColor="var(--magic-mint)" />
              <stop offset="0.58" stopColor="var(--magic-sky)" />
              <stop offset="1" stopColor="var(--magic-purple)" />
            </radialGradient>
            <linearGradient id="dragonWing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--magic-peach)" />
              <stop offset="1" stopColor="var(--magic-pink)" />
            </linearGradient>
            <radialGradient id="dragonStar" cx="50%" cy="40%" r="60%">
              <stop offset="0" stopColor="var(--magic-yellow)" />
              <stop offset="0.7" stopColor="var(--magic-orange)" />
              <stop offset="1" stopColor="var(--magic-pink)" />
            </radialGradient>
            <filter id="dragonGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0.65 0 1 0 0 0.35 0 0 1 0 1 0 0 0 0.6 0"
              />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse className="dragon-shadow" cx="38" cy="68" rx="20" ry="6" />
          <g className="dragon-aura" filter="url(#dragonGlow)">
            <circle cx="38" cy="38" r="22" />
          </g>

          <g className="dragon-tail">
            <path d="M52 52 C70 54 74 38 60 35 C70 44 60 48 51 45" fill="none" stroke="url(#dragonBody)" strokeWidth="8" strokeLinecap="round" />
            <path d="M68 35 l7 -5 l-1 9 z" fill="var(--magic-yellow)" />
          </g>

          <g className="dragon-wing dragon-wing-left">
            <path d="M25 32 C9 19 9 44 22 49 C20 41 25 38 31 38 Z" fill="url(#dragonWing)" />
            <path d="M22 39 C17 39 14 42 12 47" stroke="var(--magic-purple)" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
          </g>
          <g className="dragon-wing dragon-wing-right">
            <path d="M50 31 C63 16 68 40 55 48 C56 40 51 37 45 38 Z" fill="url(#dragonWing)" />
            <path d="M55 39 C61 38 64 41 67 45" stroke="var(--magic-purple)" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
          </g>

          <g className="dragon-body">
            <path d="M19 43 C19 27 30 17 42 18 C56 19 64 31 61 45 C58 60 47 67 35 64 C25 62 19 54 19 43 Z" fill="url(#dragonBody)" />
            <path d="M35 23 L38 12 L43 23" fill="var(--magic-yellow)" />
            <path d="M46 24 L54 15 L53 28" fill="var(--magic-peach)" />
            <ellipse cx="41" cy="47" rx="15" ry="13" fill="color-mix(in oklab, var(--magic-yellow) 38%, white)" opacity="0.9" />
            <circle cx="32" cy="36" r="4.4" fill="var(--foreground)" />
            <circle cx="50" cy="36" r="4.4" fill="var(--foreground)" />
            <circle cx="33.5" cy="34.5" r="1.5" fill="var(--background)" />
            <circle cx="51.5" cy="34.5" r="1.5" fill="var(--background)" />
            <circle cx="26" cy="43" r="3" fill="var(--magic-pink)" opacity="0.55" />
            <circle cx="56" cy="43" r="3" fill="var(--magic-pink)" opacity="0.55" />
            <path d="M35 47 C39 52 45 52 49 47" fill="none" stroke="var(--foreground)" strokeWidth="2.2" strokeLinecap="round" />
          </g>

          <g className="dragon-wand">
            <path d="M57 28 L72 12" stroke="var(--magic-purple)" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M70 3 L72.8 9.2 L79.4 9.8 L74.3 14.1 L75.9 20.7 L70 17.2 L64.1 20.7 L65.7 14.1 L60.6 9.8 L67.2 9.2 Z" fill="url(#dragonStar)" stroke="var(--background)" strokeWidth="1.2" strokeLinejoin="round" />
          </g>

          <g className="dragon-sparkles">
            <circle cx="17" cy="18" r="2" />
            <circle cx="8" cy="34" r="1.3" />
            <circle cx="67" cy="62" r="1.7" />
          </g>
        </svg>
      </div>
    </>
  );
}
