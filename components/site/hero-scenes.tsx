"use client";

import { useEffect, useRef } from "react";
import { SCENES, W, H } from "./scenes";
import { type Kit, clamp, smooth } from "./scenes/kit";

// The home hero figure: short dotted scenes that fade into one another, each with its own caption.
// Drawn small and scaled up with crisp pixels. Still on small screens and with reduced motion
// (the finished product card of the first scene).

const HOLD = 4600; // ms from one scene's start to the next
const FADE = 800; // ms crossfade
const LEN = HOLD + FADE;
const CYCLE = HOLD * SCENES.length;

/** A scene's visibility at its local time u: fades in over the first FADE, out over the last FADE. */
function visibility(u: number) {
  if (u < 0 || u >= LEN) return 0;
  const k_in = clamp(u / FADE);
  const k_out = clamp((u - HOLD) / FADE);
  // The incoming scene waits a beat so the two never sit at half strength on top of each other.
  return smooth((k_in - 0.3) / 0.7) * (1 - smooth(k_out / 0.7));
}

export function HeroScenes({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const caps = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    const boot = () => {
      if (!cancelled) cleanup = setup() ?? (() => {});
    };
    const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(boot, { timeout: 2500 }) : setTimeout(boot, 1200));
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", idle);
      cleanup();
    };

    function setup(): (() => void) | void {
      const cv = canvas.current!;
      const g = cv.getContext("2d");
      if (!g) return;
      const kit: Kit = { g, s: 1, ink: "#202124", accent: "#c56a3a", accentInk: "#ffffff", font: "monospace", alpha: 1 };
      // Backing store at device resolution, so text stays sharp; the logical drawing is W x H.
      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(cv.clientWidth * dpr));
        kit.s = w / W;
        cv.width = w;
        cv.height = Math.round(H * kit.s);
      };
      fit();
      const colors = () => {
        const cs = getComputedStyle(document.documentElement);
        kit.ink = cs.getPropertyValue("--ink").trim() || kit.ink;
        kit.accent = cs.getPropertyValue("--accent").trim() || kit.accent;
        kit.accentInk = cs.getPropertyValue("--accent-ink").trim() || kit.accentInk;
        kit.font = `${cs.getPropertyValue("--font-mono").trim() || "ui-monospace"}, monospace`;
      };
      colors();
      const scheme = window.matchMedia("(prefers-color-scheme: dark)");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const small = window.matchMedia("(max-width: 767px)");

      const showCaptions = (a: number[]) => caps.current.forEach((el, i) => el && (el.style.opacity = String(a[i] ?? 0)));

      const draw = (clock: number, still: boolean) => {
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, cv.width, cv.height);
        if (still) {
          kit.alpha = 1;
          SCENES[0].draw(kit, 1, 0);
          g.globalAlpha = 1;
          showCaptions([1]);
          return;
        }
        const alphas = SCENES.map((scene, i) => {
          const raw = clock - i * HOLD;
          const u = raw < 0 ? -1 : raw % CYCLE;
          const a = visibility(u);
          if (a > 0.003) {
            kit.alpha = a;
            scene.draw(kit, clamp(u / LEN), u);
          }
          return a;
        });
        g.globalAlpha = 1;
        showCaptions(alphas);
      };

      let raf = 0;
      let visible = true;
      let last = 0;
      let clock = 0; // animation time: only counts while the figure is on screen
      const still = () => reduced.matches || small.matches;
      const frame = (now: number) => {
        const dt = last ? Math.min(now - last, 100) : 0;
        if (dt >= 32 || !last) {
          last = now;
          clock += dt;
          draw(clock, false);
        }
        if (visible) raf = requestAnimationFrame(frame);
      };
      const run = () => {
        cancelAnimationFrame(raf);
        last = 0;
        if (still()) draw(0, true);
        else if (visible) raf = requestAnimationFrame(frame);
      };
      const recolor = () => {
        colors();
        run();
      };
      const ro = new ResizeObserver(() => {
        fit();
        run();
      });
      ro.observe(cv);
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        run();
      });
      io.observe(cv);
      scheme.addEventListener("change", recolor);
      reduced.addEventListener("change", run);
      small.addEventListener("change", run);
      run();
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        scheme.removeEventListener("change", recolor);
        reduced.removeEventListener("change", run);
        small.removeEventListener("change", run);
      };
    }
  }, []);

  return (
    <>
      <canvas ref={canvas} aria-hidden className={`block w-full ${className}`} style={{ aspectRatio: `${W} / ${H}` }} />
      <figcaption className="mt-1 grid font-mono text-[11px] text-ink-3">
        {SCENES.map((s, i) => (
          <span
            key={s.fig}
            ref={(el) => {
              caps.current[i] = el;
            }}
            className="col-start-1 row-start-1 flex justify-between"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <span>{s.fig}</span>
            <span>{s.caption}</span>
          </span>
        ))}
      </figcaption>
    </>
  );
}
