"use client";

import { useState, useSyncExternalStore } from "react";
import { ENGAGEMENTS, SITE } from "@/data/site";

type Currency = "inr" | "usd";

/** Visitors in India see rupees; everyone else dollars. Either can switch. */
function guessCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz === "Asia/Kolkata" || tz === "Asia/Calcutta" ? "inr" : "usd";
  } catch {
    return "usd";
  }
}

const noop = () => () => {};

function Barcode({ seed }: { seed: string }) {
  const bars = Array.from({ length: 46 }, (_, i) => ((seed.charCodeAt(i % seed.length) * (i + 7)) % 4) + 1);
  return (
    <svg aria-hidden viewBox={`0 0 ${bars.reduce((a, b) => a + b + 1, 0)} 30`} className="h-9 w-full">
      {bars.reduce<{ x: number; els: React.ReactElement[] }>(
        (acc, w, i) => {
          if (i % 2 === 0) acc.els.push(<rect key={i} x={acc.x} y={0} width={w} height={30} fill="currentColor" />);
          acc.x += w + 1;
          return acc;
        },
        { x: 0, els: [] },
      ).els}
    </svg>
  );
}

export function ReceiptPricing() {
  const [id, setId] = useState(ENGAGEMENTS[0].id);
  // The server renders dollars; the browser switches to its guess, until the visitor picks.
  const guessed = useSyncExternalStore(noop, guessCurrency, () => "usd" as Currency);
  const [chosen, setCur] = useState<Currency | null>(null);
  const cur = chosen ?? guessed;
  const [printed, setPrinted] = useState(0);

  const e = ENGAGEMENTS.find((x) => x.id === id)!;
  const price = cur === "inr" ? e.inr : e.usd;
  const choose = (next: string) => {
    if (next === id) return;
    setId(next);
    setPrinted((n) => n + 1);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
      <div>
        <div role="tablist" aria-label="Engagement" className="grid gap-3 sm:grid-cols-2">
          {ENGAGEMENTS.map((x) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={x.id === id}
              onClick={() => choose(x.id)}
              className={`rounded-2xl border p-5 text-left transition-colors ${x.id === id ? "border-ink bg-sheet" : "border-rule hover:border-ink-3"}`}
            >
              <span className="label">{x.timeline}</span>
              <span className="serif mt-2 block text-3xl">{x.name}</span>
              <span className="mt-1 block text-sm text-ink-2">{x.line}</span>
              <span className="mt-3 block font-mono text-sm">
                from {cur === "inr" ? x.inr : x.usd}
                {x.per ? ` / ${x.per}` : ""}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3 text-sm">
          <span className="text-ink-3">Show prices in</span>
          <div className="inline-flex rounded-full border border-rule p-1">
            {(["inr", "usd"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCur(c)}
                aria-pressed={cur === c}
                className={`rounded-full px-3 py-1 font-mono text-xs ${cur === c ? "bg-ink text-paper" : "text-ink-2"}`}
              >
                {c === "inr" ? "₹ INR" : "$ USD"}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-6 max-w-xl text-sm text-ink-3">
          Prices are starting points for a typical scope, before GST where it applies. Every engagement is quoted in writing after an intro call, and
          the audit fee is credited if you go on to a build with us.
        </p>
      </div>

      <div className="lg:sticky lg:top-24">
        <div className="mx-auto h-3 w-[92%] rounded-full bg-ink/80" aria-hidden />
        <div key={printed} className="receipt printing -mt-1.5 mx-auto w-[86%] px-6 pb-10 pt-7 font-mono text-[13px] text-ink" aria-live="polite">
          <p className="text-center tracking-[0.25em]">ANVIONIX/LABS</p>
          <p className="mt-1 text-center text-[11px] text-ink-3">ENGAGEMENT SLIP</p>
          <div className="my-4 border-t border-dashed border-ink/40" />
          <p className="flex justify-between">
            <span>ITEM</span>
            <span className="uppercase">{e.name}</span>
          </p>
          <p className="flex justify-between">
            <span>TIME</span>
            <span>{e.timeline}</span>
          </p>
          <div className="my-4 border-t border-dashed border-ink/40" />
          <ul className="space-y-1.5">
            {e.scope.map((s) => (
              <li key={s} className="flex gap-2">
                <span aria-hidden>+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 border-t border-dashed border-ink/40" />
          <p className="flex items-baseline justify-between text-base">
            <span>FROM</span>
            <span className="text-2xl">
              {price}
              {e.per && <span className="text-xs">/{e.per === "month" ? "mo" : e.per}</span>}
            </span>
          </p>
          <div className="my-4 border-t border-dashed border-ink/40" />
          <Barcode seed={e.id + cur} />
          <p className="mt-3 text-center text-[11px] text-ink-3">FINAL QUOTE AFTER A 30-MIN CALL</p>
        </div>
        <a
          href={SITE.calendly}
          target="_blank"
          rel="noopener"
          className="mx-auto mt-6 flex w-[86%] items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-paper hover:bg-accent hover:text-accent-ink transition-colors"
        >
          Book a call about this <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
