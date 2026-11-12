"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Experiment } from "@/data/site";

/**
 * After The Long Light: the case study is a book lying on a linen table. Scrolling lifts the cover
 * open onto the first spread: the problem and hypothesis on the left, the screenshot and results on
 * the right. On phones and with reduced motion the spread is simply shown open.
 */
export function CaseBook({ e, color }: { e: Experiment; color: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current!;
    const lid = cover.current!;
    const whole = book.current!;
    const leftPage = left.current!;
    const live = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!live.matches) {
        lid.style.transform = "rotateY(-180deg)";
        whole.style.transform = "none";
        leftPage.style.opacity = "1";
        return;
      }
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const x = Math.min(1, Math.max(0, (p - 0.08) / 0.6));
      const k = x * x * (3 - 2 * x);
      lid.style.transform = `rotateY(${-180 * k}deg)`;
      // The left page is under the cover until the cover swings past upright (its back face is hidden).
      leftPage.style.opacity = String(Math.min(1, Math.max(0, (k - 0.45) / 0.15)));
      // Closed, the book sits on the right half and leans back; open, it lies flat and centred.
      whole.style.transform = `translateX(${(1 - k) * -25}%) rotateX(${(1 - k) * 28}deg) scale(${0.82 + 0.18 * k})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    live.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      live.removeEventListener("change", onScroll);
    };
  }, []);

  const page = "absolute inset-0 overflow-hidden bg-[#fbf6ea] text-[#1d2340] [backface-visibility:hidden]";

  return (
    <div ref={stage} className="relative lg:h-[190vh]">
      <div className="lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-64px)] lg:items-center lg:justify-center">
        <div className="relative mx-auto w-full max-w-[1100px] lg:h-[min(640px,78dvh)] lg:[perspective:2400px]">
          <div ref={book} className="relative h-full w-full [transform-style:preserve-3d] lg:transition-none">
            {/* The spread underneath: real content, in the page for everyone. */}
            <div className="grid gap-4 lg:absolute lg:inset-0 lg:grid-cols-2 lg:gap-0">
              <div ref={left} className="relative overflow-hidden rounded-2xl bg-[#fbf6ea] p-7 text-[#1d2340] shadow-[0_30px_60px_-30px_rgba(60,40,10,.45)] md:p-10 lg:rounded-r-none">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color }}>
                  Experiment {e.no} · {e.kind}
                </p>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6e6c72]">Problem</p>
                <p className="mt-2 text-[17px] leading-relaxed">{e.problem}</p>
                <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6e6c72]">Hypothesis</p>
                <p className="serif mt-2 text-[26px] leading-snug md:text-3xl">
                  <em>{e.hypothesis}</em>
                </p>
                <p className="absolute bottom-5 left-7 font-mono text-[11px] text-[#6e6c72] md:left-10">{e.stack.join(" · ")}</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-[#fbf6ea] p-7 text-[#1d2340] shadow-[0_30px_60px_-30px_rgba(60,40,10,.45)] md:p-10 lg:rounded-l-none">
                <div className="overflow-hidden rounded-lg border border-[#1d2340]/10">
                  <Image src={e.image} alt={e.imageAlt} width={e.imageSize?.[0] ?? 1456} height={e.imageSize?.[1] ?? 834} priority sizes="(min-width: 1024px) 480px, 100vw" className="h-auto w-full" />
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                  {e.results.map((r) => (
                    <div key={r.label} className="border-t border-[#1d2340]/15 pt-2">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6e6c72]">{r.label}</dt>
                      <dd className="mt-0.5 font-mono text-lg">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-24 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(60,40,10,.12)_47%,rgba(60,40,10,.22)_50%,rgba(60,40,10,.12)_53%,transparent)] lg:block" />
            </div>

            {/* The cover: hinged on the spine, it lifts open as you scroll. */}
            <div
              ref={cover}
              aria-hidden
              className="absolute inset-y-0 right-0 hidden w-1/2 origin-left [transform-style:preserve-3d] lg:block"
              style={{ transform: "rotateY(0deg)" }}
            >
              <div className={`${page} rounded-r-2xl`} style={{ background: color, boxShadow: "0 40px 70px -30px rgba(40,25,5,.6)" }}>
                <div className="absolute inset-5 rounded-lg border border-[#e9d6a6]/50" />
                <div className="absolute inset-7 rounded-md border border-[#e9d6a6]/25" />
                <div className="flex h-full flex-col items-center justify-center px-12 text-center text-[#f1e3bd]">
                  <svg viewBox="0 0 120 60" className="w-28 opacity-90" aria-hidden>
                    <path d="M10 50 H110" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M30 50 A30 30 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    {Array.from({ length: 9 }, (_, i) => {
                      const a = Math.PI * (0.1 + (0.8 * i) / 8);
                      return (
                        <line key={i} x1={60 - Math.cos(a) * 36} y1={50 - Math.sin(a) * 36} x2={60 - Math.cos(a) * 46} y2={50 - Math.sin(a) * 46} stroke="currentColor" strokeWidth="1.5" />
                      );
                    })}
                  </svg>
                  <p className="serif mt-6 text-6xl leading-none">
                    <em>{e.name}</em>
                  </p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em]">
                    Experiment {e.no} · {e.kind}
                  </p>
                  <p className="absolute bottom-10 font-mono text-[10px] uppercase tracking-[0.24em] opacity-70">Anvionix Labs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
