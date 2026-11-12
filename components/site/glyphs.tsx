"use client";

import { useEffect, useRef } from "react";

// What lifts off the notebook's pages: code, lab words and the odd result.
const POOL = [
  "{", "}", "<", "/>", ";", "=", "=>", "0", "1", "#", "*", "//", "fn", "git", "ok", "200", "λ", "∆",
  "hypothesis", "build", "measure", "ship", "deploy", "test", "api", "db", "ui", "v1", "live",
];

type Glyph = { x: number; y: number; vx: number; vy: number; life: number; max: number; text: string; size: number };

/**
 * Letters and words rising off the pages and dissolving, drawn small and scaled up so
 * they share the dithered object's pixel grid. Off screen it stops; with reduced motion it
 * never starts.
 */
export function GlyphStream({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const W = 240;
    const H = 300;
    cv.width = W;
    cv.height = H;
    const css = getComputedStyle(document.documentElement);
    const font = css.getPropertyValue("--font-mono") || "monospace";
    let ink = css.getPropertyValue("--ink").trim() || "#16181b";
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const recolor = () => (ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim());
    scheme.addEventListener("change", recolor);

    const glyphs: Glyph[] = [];
    const spawn = () => {
      const word = Math.random() < 0.18;
      glyphs.push({
        x: W * (0.28 + Math.random() * 0.44),
        y: H * (0.62 + Math.random() * 0.08),
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.25 + Math.random() * 0.45),
        life: 0,
        max: 160 + Math.random() * 140,
        text: POOL[word ? 18 + Math.floor(Math.random() * (POOL.length - 18)) : Math.floor(Math.random() * 18)],
        size: word ? 9 : 8 + Math.floor(Math.random() * 5),
      });
    };

    let raf = 0;
    let visible = true;
    let tick = 0;
    const frame = () => {
      tick++;
      if (tick % 6 === 0 && glyphs.length < 46) spawn();
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = ink;
      ctx.textBaseline = "middle";
      for (let i = glyphs.length - 1; i >= 0; i--) {
        const g = glyphs[i];
        g.life++;
        g.x += g.vx + Math.sin((g.life + i * 17) / 24) * 0.15;
        g.y += g.vy;
        const k = g.life / g.max;
        if (k >= 1 || g.y < -10) {
          glyphs.splice(i, 1);
          continue;
        }
        // Fade in, hold, then dissolve near the top.
        ctx.globalAlpha = k < 0.15 ? k / 0.15 : k > 0.7 ? Math.max(0, 1 - (k - 0.7) / 0.3) : 1;
        ctx.font = `${g.size}px ${font}`;
        ctx.fillText(g.text, Math.round(g.x), Math.round(g.y));
      }
      ctx.globalAlpha = 1;
      if (visible) raf = requestAnimationFrame(frame);
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
      scheme.removeEventListener("change", recolor);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className={`pointer-events-none h-full w-full [image-rendering:pixelated] ${className}`} />;
}

/** Text typed key by key with a blinking caret. Pure CSS, so the words are in the HTML from the start. */
export function TypeText({ text, start = 0, speed = 32, caret = false }: { text: string; start?: number; speed?: number; caret?: boolean }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="type-ch" style={{ animationDelay: `${start + i * speed}ms` }}>
          {ch}
        </span>
      ))}
      {caret && <span aria-hidden className="type-caret" style={{ animationDelay: `${start + text.length * speed}ms` }} />}
    </>
  );
}
