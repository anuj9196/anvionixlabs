"use client";

import { useEffect, useState } from "react";
import type { JourneyShape } from "@/data/site";
import { DitherObject } from "./dither";

type Step = { text: string; shape: JourneyShape };

/**
 * After Nightjar: a question, the visible thinking steps (the object morphs at each one), then the
 * answer streaming in word by word, sharpening out of a blur. Everything is in the HTML from the
 * start; the sequence only decides what is shown when.
 */
export function Thinking({
  question,
  steps,
  final,
  children,
}: {
  question: string;
  steps: Step[];
  final: JourneyShape;
  children: React.ReactNode;
}) {
  // -1: question only; 0..n-1: thinking; n: answered.
  const [phase, setPhase] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const n = steps.length;
  const done = phase >= n;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => {
        setPhase(n);
        setElapsed(n * 1.1 + 0.6);
      }, 0);
      return () => clearTimeout(t);
    }
    const timers = Array.from({ length: n }, (_, i) => window.setTimeout(() => setPhase(i), 700 + i * 1100));
    timers.push(window.setTimeout(() => setPhase(n), 700 + n * 1100));
    const start = performance.now();
    const tick = window.setInterval(() => setElapsed((performance.now() - start) / 1000), 100);
    const stop = window.setTimeout(() => window.clearInterval(tick), 700 + n * 1100);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(stop);
      clearInterval(tick);
    };
  }, [n]);

  const shape = done ? final : phase >= 0 ? steps[phase].shape : steps[0].shape;

  return (
    <div className="grid min-h-[calc(100dvh-120px)] overflow-hidden rounded-[28px] border border-rule bg-sheet shadow-[0_30px_80px_-50px_rgba(0,0,0,.35)] lg:grid-cols-[1fr_1.05fr]">
      <div className="relative flex items-center justify-center p-8 lg:p-14">
        <div className="w-full max-w-[460px]">
          <DitherObject shape={shape} res={200} />
        </div>
        <p aria-hidden className="absolute bottom-5 left-6 font-mono text-[11px] text-ink-3">
          {done ? "Answered" : "Thinking"} · {String(Math.min(phase + 2, steps.length + 1)).padStart(2, "0")} / {String(steps.length + 1).padStart(2, "0")}
        </p>
      </div>
      <div className="flex flex-col border-t border-rule p-6 md:p-10 lg:border-l lg:border-t-0">
        <h1 className="text-xl font-medium md:text-2xl">{question}</h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-ink-3" aria-hidden>
          <span className={`inline-block h-2 w-2 rounded-[2px] ${done ? "bg-ink-3" : "bg-accent animate-pulse"}`} />
          {done ? `Thought for ${elapsed.toFixed(1)}s` : `Thinking ${elapsed.toFixed(1)}s`}
        </p>
        <ol className={`mt-4 space-y-1.5 text-sm transition-all duration-700 ${done ? "max-h-0 overflow-hidden opacity-0 lg:max-h-60 lg:opacity-60" : "max-h-60"}`}>
          {steps.map((s, i) => (
            <li
              key={s.text}
              className={`transition-[opacity,filter] duration-500 ${i <= phase || done ? "opacity-100 blur-0" : "opacity-0 blur-[3px]"} ${i === phase && !done ? "text-ink" : "text-ink-3"}`}
            >
              {s.text}
            </li>
          ))}
        </ol>
        <div className={`answer mt-6 ${done ? "shown" : ""}`}>{children}</div>
      </div>
    </div>
  );
}

/** Splits text into words that stream in once the answer is shown (styles in globals.css). */
export function Stream({ text, from = 0 }: { text: string; from?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="aw" style={{ ["--i" as string]: from + i }}>
          {w}{" "}
        </span>
      ))}
    </>
  );
}
