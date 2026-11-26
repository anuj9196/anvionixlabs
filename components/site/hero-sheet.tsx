"use client";

import { useEffect, useRef } from "react";

// The home hero figure: a thin dotted sheet in perspective, with a few tokens rising out of it.
// Drawn small and scaled up with crisp pixels, like the rest of the dithered figures.

const W = 360;
const H = 250;
const FAR_Y = 0.68 * H; // the sheet's back edge: tokens are revealed above it, never over dots
const NEAR_Y = 0.94 * H;
const FAR_HALF = 0.34 * W;
const NEAR_HALF = 0.49 * W;
const ROWS = 15;
const COLS = 43;
const TOP_Y = 0.07 * H;
const PERIOD = 14000; // ms for one token to rise and fade
const SIZE = 11;

// One token per lane. Lanes are evenly spaced wider than the widest label, so labels cannot overlap.
const LANES: { text: string; accent: boolean }[] = [
  { text: "git", accent: false },
  { text: "ship", accent: true },
  { text: "api", accent: false },
  { text: "{}", accent: false },
  { text: "v1", accent: true },
  { text: "ok", accent: false },
];
const LANE_SPAN = 0.8 * FAR_HALF; // half-width the lanes cover

const laneX = (i: number) => W / 2 + ((i / (LANES.length - 1)) * 2 - 1) * LANE_SPAN;

/** Progress 0..1 of a lane's token at a time, staggered so the lanes are never in step. */
const progress = (i: number, ms: number) => (((ms / PERIOD + (i * 5) / LANES.length) % 1) + 1) % 1;

export function HeroSheet({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

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
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      // Backing store at device resolution, so text stays sharp; the logical drawing is W x H.
      let s = 1;
      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(cv.clientWidth * dpr));
        s = w / W;
        cv.width = w;
        cv.height = Math.round(H * s);
      };
      fit();
      const root = document.documentElement;
      let ink = "#202124";
      let accent = "#c56a3a";
      let font = "monospace";
      const colors = () => {
        const cs = getComputedStyle(root);
        ink = cs.getPropertyValue("--ink").trim() || ink;
        accent = cs.getPropertyValue("--accent").trim() || accent;
        font = `${cs.getPropertyValue("--font-mono").trim() || "ui-monospace"}, monospace`;
      };
      colors();
      const scheme = window.matchMedia("(prefers-color-scheme: dark)");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const small = window.matchMedia("(max-width: 767px)");

      const draw = (ms: number, still: boolean) => {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        // The sheet: even rows and columns that converge toward the back edge, drawn as crisp squares.
        ctx.fillStyle = ink;
        for (let r = 0; r < ROWS; r++) {
          const t = r / (ROWS - 1);
          const y = FAR_Y + (NEAR_Y - FAR_Y) * Math.pow(t, 1.4);
          const half = FAR_HALF + (NEAR_HALF - FAR_HALF) * t;
          const d = Math.max(1, Math.round(s * (0.8 + 0.9 * t)));
          ctx.globalAlpha = 0.4 + 0.45 * t;
          for (let c = 0; c < COLS; c++) {
            const x = W / 2 + (c / (COLS - 1) - 0.5) * 2 * half;
            ctx.fillRect(Math.round(x * s), Math.round(y * s), d, d);
          }
        }
        ctx.setTransform(s, 0, 0, s, 0, 0);
        // The tokens, clipped to the area above the sheet so no label ever sits on dots.
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, W, FAR_Y - 3);
        ctx.clip();
        ctx.font = `${SIZE}px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        LANES.forEach((l, i) => {
          const k = still ? 0.2 + 0.55 * (((i * 5) % LANES.length) / (LANES.length - 1)) : progress(i, ms);
          const y = FAR_Y + 4 - (FAR_Y + 4 - TOP_Y) * k;
          // Fade in as it leaves the sheet, then fade out the higher it gets.
          ctx.globalAlpha = k < 0.1 ? k / 0.1 : Math.max(0, 1 - Math.pow((k - 0.1) / 0.9, 1.4));
          ctx.fillStyle = l.accent ? accent : ink;
          ctx.fillText(l.text, Math.round(laneX(i)), Math.round(y));
        });
        ctx.restore();
        ctx.globalAlpha = 1;
      };

      let raf = 0;
      let visible = true;
      let last = 0;
      const start = performance.now();
      const still = () => reduced.matches || small.matches;
      const frame = (now: number) => {
        if (now - last >= 32) {
          last = now;
          draw(now - start, false);
        }
        if (visible) raf = requestAnimationFrame(frame);
      };
      const run = () => {
        cancelAnimationFrame(raf);
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

  return <canvas ref={canvas} aria-hidden className={`block w-full ${className}`} style={{ aspectRatio: `${W} / ${H}` }} />;
}
