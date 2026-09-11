import { useEffect, useRef, useState } from "react";

type State = "default" | "hover" | "card";

/**
 * MagicCursor — a small matte 3D toy pointer.
 *
 * Molded-plastic look: soft rounded geometry, gentle top light,
 * a subtle bevel and a tiny contact shadow. No gloss, no glow,
 * no particles. Desktop (fine pointer) only; disabled on touch
 * devices and when the user prefers reduced motion.
 */
export function MagicCursor() {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    x: -120,
    y: -120,
    tx: -120,
    ty: -120,
    hover: "default" as State,
    down: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    document.documentElement.classList.add("magic-cursor-active");
    const s = state.current;

    const interactive =
      'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]';
    const cardish = '.shadow-card, .shadow-float, [data-cursor="card"]';

    const onMove = (e: PointerEvent) => {
      s.tx = e.clientX;
      s.ty = e.clientY;
      const el = e.target as HTMLElement | null;
      if (el?.closest(interactive)) s.hover = "hover";
      else if (el?.closest(cardish)) s.hover = "card";
      else s.hover = "default";
    };
    const onDown = () => {
      s.down = true;
    };
    const onUp = () => {
      s.down = false;
    };
    const onLeave = () => {
      s.tx = -160;
      s.ty = -160;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    let raf = 0;
    const tick = () => {
      s.x += (s.tx - s.x) * 0.26;
      s.y += (s.ty - s.y) * 0.26;
      const tilt = Math.max(-7, Math.min(7, (s.tx - s.x) * 0.06));
      cursor.style.transform = `translate3d(${s.x - 5}px, ${s.y - 4}px, 0) rotate(${tilt}deg)`;
      cursor.dataset.state = s.hover;
      cursor.dataset.down = s.down ? "1" : "0";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("magic-cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="magic-cursor toy-cursor pointer-events-none fixed left-0 top-0 z-[9999] size-9 will-change-transform"
    >
      <svg viewBox="0 0 36 36" className="size-full overflow-visible" role="presentation">
        <defs>
          {/* Matte molded plastic: soft top light fading into a deeper base */}
          <linearGradient id="tcMatte" x1="0.25" y1="0" x2="0.7" y2="1">
            <stop offset="0" stopColor="var(--magic-pink)" />
            <stop offset="0.55" stopColor="var(--magic-purple)" />
            <stop offset="1" stopColor="var(--magic-purple)" />
          </linearGradient>
        </defs>

        {/* tiny contact shadow on the surface below */}
        <ellipse className="tc-contact" cx="12" cy="27.5" rx="7" ry="2.2" />

        <g className="tc-body">
          {/* soft bevel underside */}
          <path
            d="M4.6 6.2 C4.6 3.9 6.6 2.6 8.4 3.7 L25.6 14.4 C27.7 15.7 27.1 18.6 24.7 19 L17.6 20.2 C16.8 20.3 16.1 20.8 15.7 21.5 L12.4 27.2 C11.2 29.2 8.3 28.7 8 26.4 Z"
            fill="oklch(0.42 0.12 300 / 0.55)"
            transform="translate(0 1.3)"
          />
          {/* main molded body */}
          <path
            d="M4.6 6.2 C4.6 3.9 6.6 2.6 8.4 3.7 L25.6 14.4 C27.7 15.7 27.1 18.6 24.7 19 L17.6 20.2 C16.8 20.3 16.1 20.8 15.7 21.5 L12.4 27.2 C11.2 29.2 8.3 28.7 8 26.4 Z"
            fill="url(#tcMatte)"
            stroke="oklch(1 0 0 / 0.55)"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          {/* single soft ambient highlight — diffused, never glossy */}
          <path
            d="M7.2 6.4 L15.4 11.6"
            stroke="oklch(1 0 0 / 0.3)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
