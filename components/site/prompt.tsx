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
export function BuildPrompt() {
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
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    flare.current = 1;
    const idea = text.trim();
    const url = idea ? `${SITE.calendly}?a1=${encodeURIComponent(idea)}` : SITE.calendly;
    window.setTimeout(() => window.open(url, "_blank", "noopener"), 380);
  };

  return (
    <div className="relative mx-auto max-w-4xl">
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <form onSubmit={submit} className="relative mx-auto flex min-h-[420px] max-w-xl flex-col items-center justify-center px-2 py-16 text-center md:min-h-[480px]">
        <label htmlFor="build-idea" className="label">
          New experiment
        </label>
        <h2 className="serif mt-3 text-5xl md:text-6xl leading-none">
          What are you <em>building?</em>
        </h2>
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
