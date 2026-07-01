import { useEffect, useRef, useState } from "react";

/**
 * MagicCursor — a floating glowing magic wand + star that follows the pointer,
 * leaves a sparkle particle trail, and reacts to interactive elements.
 * Automatically disabled on touch / coarse-pointer devices.
 */
export function MagicCursor() {
  const [enabled, setEnabled] = useState(false);
  const wandRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    x: -100,
    y: -100,
    tx: -100,
    ty: -100,
    hover: false,
    down: false,
    particles: [] as {
      x: number; y: number; vx: number; vy: number;
      life: number; max: number; hue: number; size: number;
    }[],
    lastSpawn: 0,
  });

  useEffect(() => {
    // Only enable on fine pointer (mouse) + not reduced motion
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("magic-cursor-active");

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const s = state.current;

    const onMove = (e: PointerEvent) => {
      s.tx = e.clientX;
      s.ty = e.clientY;
      const el = e.target as HTMLElement | null;
      s.hover = !!el?.closest(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]'
      );
    };
    const onDown = () => { s.down = true; burst(s.tx, s.ty, 14); };
    const onUp = () => { s.down = false; };
    const onLeave = () => { s.tx = -200; s.ty = -200; };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointerleave", onLeave);

    function burst(x: number, y: number, n = 10) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 1 + Math.random() * 3;
        s.particles.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.5,
          life: 0,
          max: 40 + Math.random() * 30,
          hue: 280 + Math.random() * 80,
          size: 1.5 + Math.random() * 2.5,
        });
      }
    }

    let raf = 0;
    const tick = (t: number) => {
      // Smooth follow
      s.x += (s.tx - s.x) * 0.22;
      s.y += (s.ty - s.y) * 0.22;

      if (wandRef.current) {
        const scale = s.hover ? 1.35 : s.down ? 0.85 : 1;
        wandRef.current.style.transform =
          `translate3d(${s.x - 18}px, ${s.y - 18}px, 0) scale(${scale})`;
        wandRef.current.dataset.hover = s.hover ? "1" : "0";
      }

      // Spawn trail particles
      if (t - s.lastSpawn > 22) {
        s.lastSpawn = t;
        const dx = s.tx - s.x, dy = s.ty - s.y;
        const moving = dx * dx + dy * dy > 4;
        if (moving || s.hover) {
          s.particles.push({
            x: s.x + (Math.random() - 0.5) * 8,
            y: s.y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -0.4 - Math.random() * 0.6,
            life: 0,
            max: 45 + Math.random() * 25,
            hue: s.hover ? 40 + Math.random() * 40 : 280 + Math.random() * 80,
            size: 1.5 + Math.random() * 2,
          });
        }
      }

      // Draw particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        const k = 1 - p.life / p.max;
        if (k <= 0) { s.particles.splice(i, 1); continue; }
        const r = p.size * (0.6 + k * 0.8);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 75%, ${0.9 * k})`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
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
  }, []);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9998]"
      />
      <div
        ref={wandRef}
        aria-hidden
        className="magic-cursor pointer-events-none fixed left-0 top-0 z-[9999] size-9 will-change-transform"
        style={{ transition: "transform 90ms cubic-bezier(.2,.9,.2,1.1)" }}
      >
        <svg viewBox="0 0 40 40" className="size-full drop-shadow-[0_4px_10px_rgba(168,85,247,0.7)]">
          <defs>
            <linearGradient id="wandStick" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f0abfc" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
            <radialGradient id="starGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#fff5b0" />
              <stop offset="0.55" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#f472b6" />
            </radialGradient>
          </defs>
          {/* Wand stick */}
          <rect x="20" y="18" width="16" height="3.4" rx="1.7"
            transform="rotate(45 28 20)" fill="url(#wandStick)" />
          {/* Sparkles around */}
          <circle cx="30" cy="30" r="1.2" fill="#fde68a" opacity="0.9">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="34" cy="24" r="0.9" fill="#fbcfe8" opacity="0.8">
            <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite" />
          </circle>
          {/* Star head */}
          <g className="magic-star" style={{ transformOrigin: "12px 12px" }}>
            <polygon
              points="12,2 14.6,9 22,9.6 16.2,14.4 18.2,21.6 12,17.6 5.8,21.6 7.8,14.4 2,9.6 9.4,9"
              fill="url(#starGlow)"
              stroke="#fff"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </>
  );
}
