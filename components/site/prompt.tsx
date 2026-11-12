"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/data/site";

const RING = "{ } < /> ; = => 0 1 # * // λ ∆ fn api db ui ok".split(" ");
const IDEAS = [
  "An MVP for my startup",
  "A mobile app for our hardware",
  "Our app is slow and keeps breaking",
  "An audit before we raise",
];

/**
 * "What are you building?": a prompt circled by a slow ring of glyphs. Typing tightens the
 * ring, sending flares it out, then the intro call opens with the idea already filled in
 * (Calendly answers its first question from `a1`).
 */
export function BuildPrompt({ rays = false, heading = "h2" }: { rays?: boolean; heading?: "h1" | "h2" }) {
  const [text, setText] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const tension = useRef(0); // 0 calm … 1 tight, eased toward the target
  const target = useRef(0);
  const flare = useRef(0);

  useEffect(() => {
    target.current = Math.min(1, text.length / 60);
  }, [text]);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    const size = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);
    const css = getComputedStyle(document.documentElement);
    const font = css.getPropertyValue("--font-mono") || "monospace";
    const color = () => getComputedStyle(document.documentElement).getPropertyValue("--ink-3").trim();
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    const N = 64;
    let raf = 0;
    let visible = true;
    const start = performance.now();
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      tension.current += (target.current - tension.current) * 0.06;
      flare.current *= 0.94;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w * 0.46, h * 0.6);
      const radius = base * (1 - tension.current * 0.08) * (1 + flare.current * 0.5);
      ctx.font = `13px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const ink = color();
      const hot = accent();
      if (rays) {
        drawRays(t, radius, cx, cy, ink, hot);
        ctx.globalAlpha = 1;
        if (visible && !still) raf = requestAnimationFrame(frame);
        return;
      }
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + (still ? 0 : t * (0.08 + tension.current * 0.25));
        // An ellipse wider than tall, with a slow wave so the ring breathes like a school of fish.
        const wave = still ? 0 : Math.sin(a * 3 + t * 1.3) * 6 * (1 - tension.current);
        const x = cx + Math.cos(a) * (radius * 1.25 + wave);
        const y = cy + Math.sin(a) * (radius * 0.72 + wave);
        const lit = (i + Math.floor(t * 6)) % 9 === 0 || flare.current > 0.2;
        ctx.globalAlpha = lit ? 0.95 : 0.45 + tension.current * 0.35;
        ctx.fillStyle = lit ? hot : ink;
        ctx.fillText(RING[i % RING.length], x, y);
      }
      ctx.globalAlpha = 1;
      if (visible && !still) raf = requestAnimationFrame(frame);
    };
    // After Mobula: a school of rays drawn in square pixels, circling the prompt like a slow carousel.
    const RAYS = 11;
    const cell = 5;
    const ray = (x: number, y: number, heading: number, size: number, fill: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(heading);
      ctx.fillStyle = fill;
      const n = Math.round(size / cell);
      for (let gy = -n; gy <= n; gy++) {
        for (let gx = -n; gx <= n; gx++) {
          // A manta: a wide diamond (wings) with a short tail behind.
          const u = gx / n;
          const v = gy / n;
          const wing = Math.abs(v) * 1.35 + Math.abs(u) * 0.9 < 1;
          const tail = u < -0.5 && Math.abs(v) < 0.1 && u > -1.3;
          if (!wing && !tail) continue;
          const shade = 0.35 + 0.65 * (1 - Math.abs(v)) * (0.6 + 0.4 * Math.sin(gx * 1.7 + gy));
          ctx.globalAlpha = alpha * shade;
          ctx.fillRect(Math.round(gx * cell), Math.round(gy * cell), cell - 1, cell - 1);
        }
      }
      ctx.restore();
    };
    function drawRays(t: number, radius: number, x0: number, y0: number, ink: string, hot: string) {
      const gold = "#d8b46a";
      for (let i = 0; i < RAYS; i++) {
        const speed = still ? 0 : 0.06 + tension.current * 0.22;
        const a = (i / RAYS) * Math.PI * 2 + t * speed;
        const bob = still ? 0 : Math.sin(t * 0.9 + i * 1.3) * 14;
        const rx = radius * (1.55 + (i % 3) * 0.1) + bob;
        const ry = radius * (1.0 + (i % 2) * 0.12) + bob * 0.5;
        const x = x0 + Math.cos(a) * rx;
        const y = y0 + Math.sin(a) * ry;
        // Face along the orbit.
        const heading = Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx);
        const size = 24 + (i % 4) * 9;
        const fill = i % 4 === 0 ? gold : i % 3 === 0 ? hot : ink;
        ray(x, y, heading, size, fill, 0.55 + tension.current * 0.3 + flare.current * 0.3);
      }
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
    };
  }, [rays]);

  const Heading = heading;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    flare.current = 1;
    const idea = text.trim();
    const url = idea ? `${SITE.calendly}?a1=${encodeURIComponent(idea)}` : SITE.calendly;
    window.setTimeout(() => window.open(url, "_blank", "noopener"), 380);
  };

  return (
    <div className={`relative mx-auto ${rays ? "max-w-6xl" : "max-w-4xl"}`}>
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <form onSubmit={submit} className={`relative mx-auto flex ${rays ? "min-h-[560px] md:min-h-[640px]" : "min-h-[420px] md:min-h-[480px]"} max-w-xl flex-col items-center justify-center px-2 py-16 text-center`}>
        <label htmlFor="build-idea" className="label">
          New experiment
        </label>
        <Heading className="serif mt-3 text-5xl md:text-6xl leading-none">
          What are you <em>building?</em>
        </Heading>
        <div className="mt-8 w-full rounded-2xl border border-rule bg-sheet p-2 shadow-[0_20px_50px_-30px_rgba(0,0,0,.5)] focus-within:border-accent">
          <textarea
            id="build-idea"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 400))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            rows={2}
            placeholder="A line or two is enough…"
            className="w-full resize-none bg-transparent px-3 py-2 text-lg outline-none placeholder:text-ink-3"
          />
          <div className="flex items-center justify-between gap-3 px-2 pb-1">
            <span className="font-mono text-[11px] text-ink-3">↵ to send · opens a 30-min intro call</span>
            <button type="submit" className="rounded-full bg-ink px-5 py-2 text-sm text-paper hover:bg-accent hover:text-accent-ink transition-colors">
              Send <span aria-hidden>→</span>
            </button>
          </div>
        </div>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {IDEAS.map((idea) => (
            <li key={idea}>
              <button
                type="button"
                onClick={() => setText(idea)}
                className="rounded-full border border-rule bg-paper/70 px-3 py-1.5 text-sm text-ink-2 hover:border-ink-3 hover:text-ink"
              >
                {idea}
              </button>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}
