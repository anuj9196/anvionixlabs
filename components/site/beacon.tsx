"use client";

import { useEffect, useRef } from "react";

/** After Beacon: specks of light drifting up through a column of blue light. */
export function BeaconParticles() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    const size = () => {
      w = cv.width = cv.clientWidth;
      h = cv.height = cv.clientHeight;
    };
    size();
    addEventListener("resize", size);
    type P = { x: number; y: number; v: number; r: number; a: number };
    const ps: P[] = Array.from({ length: 90 }, () => ({ x: 0, y: Math.random(), v: 0, r: 0, a: 0 })).map((p) => seed(p, true));
    function seed(p: P, anywhere = false): P {
      // Most specks stay close to the column in the middle.
      const spread = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? -1 : 1);
      p.x = 0.5 + spread * 0.42;
      p.y = anywhere ? Math.random() : 1.05;
      p.v = 0.0007 + Math.random() * 0.0018;
      p.r = Math.random() < 0.12 ? 1.8 : 1;
      p.a = 0.25 + Math.random() * 0.6;
      return p;
    }
    let raf = 0;
    let visible = false;
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.v;
        if (p.y < -0.05) seed(p);
        const fade = Math.min(1, p.y * 3) * Math.min(1, (1 - p.y) * 4);
        ctx.globalAlpha = p.a * Math.max(0, fade);
        ctx.fillStyle = "#c9d3ff";
        ctx.fillRect(p.x * w, p.y * h, p.r, p.r);
      }
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
      removeEventListener("resize", size);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
