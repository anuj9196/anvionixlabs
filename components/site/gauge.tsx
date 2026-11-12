"use client";

import { useEffect, useRef, useState } from "react";

/**
 * After Valmora: an analog meter, like the battery tester's own, whose needle sweeps up to a real
 * figure when it scrolls into view, beside the spec sheet it reads from.
 */
export function Gauge({ value, max, unit, label, rows }: { value: number; max: number; unit: string; label: string; rows: { label: string; value: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);

  useEffect(() => {
    const el = ref.current!;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          raf = requestAnimationFrame(() => setK(1));
          return;
        }
        const start = performance.now();
        const step = (now: number) => {
          const x = Math.min(1, (now - start) / 1800);
          setK(1 - Math.pow(1 - x, 3));
          if (x < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // The dial sweeps 240°, from -210° (zero) to 30° (full scale).
  const at = (v: number) => (-210 + (240 * v) / max) * (Math.PI / 180);
  const needle = at(value * k);
  const ticks = Array.from({ length: max * 4 + 1 }, (_, i) => i / 4);

  return (
    <div ref={ref} className="grid items-center gap-10 rounded-[28px] border border-[#e9d6a6]/20 bg-[#141210] p-6 text-[#efe6d4] md:p-10 lg:grid-cols-[1fr_1.1fr]">
      <svg viewBox="-110 -110 220 220" className="mx-auto w-full max-w-[420px]" role="img" aria-label={`${label}: ${value} ${unit}`}>
        <circle r="104" fill="none" stroke="#e9d6a6" strokeOpacity=".25" strokeWidth="1.5" />
        <circle r="96" fill="#0d0c0a" />
        {ticks.map((t) => {
          const a = at(t);
          const major = Number.isInteger(t);
          return (
            <line
              key={t}
              x1={Math.cos(a) * (major ? 74 : 80)}
              y1={Math.sin(a) * (major ? 74 : 80)}
              x2={Math.cos(a) * 88}
              y2={Math.sin(a) * 88}
              stroke={t >= max - 0.5 ? "#d9583b" : "#efe6d4"}
              strokeWidth={major ? 2 : 1}
            />
          );
        })}
        {ticks.filter(Number.isInteger).map((t) => (
          <text key={t} x={Math.cos(at(t)) * 62} y={Math.sin(at(t)) * 62 + 4} textAnchor="middle" fontSize="11" fill="#efe6d4" fontFamily="var(--font-mono)">
            {t}
          </text>
        ))}
        <line x1={-Math.cos(needle) * 14} y1={-Math.sin(needle) * 14} x2={Math.cos(needle) * 86} y2={Math.sin(needle) * 86} stroke="#efe6d4" strokeWidth="2.5" strokeLinecap="round" />
        <circle r="7" fill="#141210" stroke="#efe6d4" strokeWidth="2" />
        <text y="44" textAnchor="middle" fontSize="30" fill="#efe6d4" fontFamily="var(--font-mono)">
          {(value * k).toFixed(1)}
          <tspan fontSize="14" dx="3">{unit}</tspan>
        </text>
        <text y="62" textAnchor="middle" fontSize="8" letterSpacing="1.6" fill="#b9ad92" fontFamily="var(--font-mono)">
          {label.toUpperCase()}
        </text>
      </svg>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#b9ad92]">Specification</p>
        <h2 className="mt-3 font-mono text-3xl uppercase leading-tight tracking-[0.04em] md:text-4xl">
          Readings from <br />
          the field.
        </h2>
        <dl className="mt-8">
          {rows.map((r, i) => (
            <div key={r.label} className="flex items-baseline justify-between gap-6 border-t border-[#efe6d4]/15 py-3">
              <dt className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#b9ad92]">
                {String(i + 1).padStart(2, "0")} · {r.label}
              </dt>
              <dd className="font-mono text-lg">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
