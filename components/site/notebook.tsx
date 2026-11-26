"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { NEXT_STEPS, type Experiment } from "@/data/site";

/** Ruled notebook paper with a margin line, used for every page. */
const PAPER =
  "bg-sheet [background-image:linear-gradient(90deg,transparent_46px,var(--mark)_46px,var(--mark)_47px,transparent_47px),repeating-linear-gradient(transparent_0_27px,var(--rule)_27px_28px)]";

function LeftPage({ e }: { e: Experiment }) {
  return (
    <div className="flex h-full flex-col pl-[64px] pr-8 py-8">
      <p className="label">
        Experiment {e.no} · {e.kind}
        {e.engagement ? ` · ${e.engagement}` : e.client ? ` · for ${e.client}` : ""}
      </p>
      <h3 className="serif mt-3 text-5xl leading-none">{e.name}</h3>
      <dl className="mt-5 space-y-4 text-[14px] leading-[28px] text-ink-2">
        <div>
          <dt className="label">Problem</dt>
          <dd>{e.problem}</dd>
        </div>
        <div>
          <dt className="label">Hypothesis</dt>
          <dd className="serif text-[19px] leading-[28px] text-ink">
            <em>{e.hypothesis}</em>
          </dd>
        </div>
      </dl>
      <p className="mt-auto font-mono text-[12px] text-ink-3">{e.stack.join(" · ")}</p>
    </div>
  );
}

function RightPage({ e }: { e: Experiment }) {
  return (
    <div className="flex h-full flex-col px-8 py-8">
      <div className="overflow-hidden rounded-xl border border-rule bg-paper">
        <Image src={e.image} alt={e.imageAlt} width={e.imageSize?.[0] ?? 1456} height={e.imageSize?.[1] ?? 834} sizes="480px" className="h-auto w-full" />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
        {e.results.map((r) => (
          <div key={r.label} className="border-t border-rule pt-2">
            <dt className="label">{r.label}</dt>
            <dd className="mt-0.5 font-mono text-xl text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex items-center gap-5 pt-4">
        <Link href={`/work/${e.slug}`} className="rounded-full border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-paper transition-colors">
          Read the report →
        </Link>
        {e.url && (
          <a href={e.url} target="_blank" rel="noopener" className="text-sm text-ink-2 underline hover:text-ink">
            {e.urlLabel}
          </a>
        )}
      </div>
    </div>
  );
}

function ClosingPage({ no }: { no: string }) {
  // Every block is a whole number of 28px ruled lines, so the text sits on the paper's rules.
  return (
    <div className="flex h-full flex-col pl-[64px] pr-10 pt-[196px]">
      <p className="label leading-[28px]">Experiment {no}</p>
      <h3 className="serif mt-[4px] text-6xl leading-[56px]">
        Yours, <em>perhaps?</em>
      </h3>
      <p className="mt-[28px] max-w-sm text-ink-2 leading-[28px]">
        Bring the problem. We will write the hypothesis, build it, and keep it running.
      </p>
      <div className="mt-[28px] flex h-[56px] items-center">
        <Link
          href="/start"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-paper hover:bg-accent-strong hover:text-accent-ink transition-colors"
        >
          Start a project <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

/** A fill-in line: a label, then a dotted rule sitting on the paper's own ruled line. */
function Blank({ label }: { label: string }) {
  return (
    <p className="flex h-[28px] items-end gap-3 font-mono text-[12px] leading-[28px] text-ink-3">
      <span className="shrink-0 leading-[27px]">{label}</span>
      <span aria-hidden className="h-full flex-1 border-b border-dotted border-ink-3/50" />
    </p>
  );
}

/** The right-hand page after the last experiment: a blank entry for the visitor to start. */
function DraftPage({ n }: { n: number }) {
  return (
    <div className="relative flex h-full flex-col pl-[64px] pr-8 pt-[28px]">
      <p className="label leading-[28px]">Experiment {String(n + 1).padStart(3, "0")} · Draft</p>
      <p className="serif mt-[28px] text-[22px] leading-[28px]">What happens next</p>
      <ol className="text-[14px] leading-[28px] text-ink-2">
        {NEXT_STEPS.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="w-6 font-mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-[28px]">
        <Blank label="Hypothesis" />
        <Blank label="Ship by" />
      </div>
      <div
        aria-hidden
        className="absolute right-8 top-[56px] flex h-[76px] w-[76px] rotate-[-12deg] items-center justify-center rounded-full border-2 border-accent text-center font-mono text-[10px] uppercase leading-[13px] tracking-[0.14em] text-accent opacity-80"
      >
        Your
        <br />
        turn
      </div>
      <div className="mt-auto">
        <p className="label leading-[28px]">End of log</p>
        <p className="font-mono text-sm leading-[28px] text-ink-2">{n} experiments · all live</p>
      </div>
    </div>
  );
}

/**
 * The experiment log as a notebook pinned to the screen: scrolling turns one leaf per
 * experiment. Each leaf carries an experiment's right-hand page on its front and the next
 * experiment's left-hand page on its back.
 */
export function NotebookLog({ items }: { items: Experiment[] }) {
  const section = useRef<HTMLDivElement>(null);
  const leaves = useRef<(HTMLDivElement | null)[]>([]);
  const n = items.length;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = section.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const s = p * n; // one leaf per step
      leaves.current.forEach((leaf, k) => {
        if (!leaf) return;
        // Hold each spread, then turn the page in the middle of its step.
        const x = Math.min(1, Math.max(0, (s - k - 0.3) / 0.45));
        const eased = x * x * (3 - 2 * x);
        const angle = -180 * eased;
        leaf.style.transform = `rotateY(${angle}deg)`;
        leaf.style.zIndex = String(eased > 0.5 ? 10 + k : 10 + n - k);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [n]);

  const page = `absolute inset-0 overflow-hidden [backface-visibility:hidden] ${PAPER}`;

  return (
    <div ref={section} style={{ height: `${(n + 1) * 85}vh` }} className="relative">
      <div className="sticky top-20 flex h-[calc(100dvh-110px)] max-h-[700px] items-center justify-center">
        <div className="relative h-full w-full max-w-[1120px] [perspective:2600px]">
          {/* Base: first experiment's left page, and the inside back cover on the right. */}
          <div className={`absolute inset-y-0 left-0 w-1/2 rounded-l-2xl border border-rule shadow-[0_30px_60px_-30px_rgba(0,0,0,.45)] ${PAPER}`}>
            <LeftPage e={items[0]} />
          </div>
          <div className={`absolute inset-y-0 right-0 w-1/2 rounded-r-2xl border border-rule shadow-[0_30px_60px_-30px_rgba(0,0,0,.45)] ${PAPER}`}>
            <DraftPage n={n} />
          </div>
          {/* The leaves that turn. */}
          {items.map((e, k) => (
            <div
              key={e.slug}
              ref={(el) => {
                leaves.current[k] = el;
              }}
              className="absolute inset-y-0 right-0 w-1/2 origin-left [transform-style:preserve-3d] will-change-transform"
              style={{ zIndex: 10 + n - k }}
            >
              <div className={`${page} rounded-r-2xl border border-rule`}>
                <RightPage e={e} />
              </div>
              <div className={`${page} rounded-l-2xl border border-rule [transform:rotateY(180deg)]`}>
                {k + 1 < n ? <LeftPage e={items[k + 1]} /> : <ClosingPage no={String(n + 1).padStart(3, "0")} />}
              </div>
            </div>
          ))}
          {/* Spine shadow. */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-40 w-16 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,.14)_48%,rgba(0,0,0,.2)_50%,rgba(0,0,0,.14)_52%,transparent)]" />
        </div>
      </div>
    </div>
  );
}
