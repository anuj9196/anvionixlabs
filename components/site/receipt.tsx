"use client";

import { useState } from "react";
import Link from "next/link";
import { ENGAGEMENTS, ENGAGEMENT_GROUPS, SITE, engagementById, type Engagement } from "@/data/site";
import { useGuessedCurrency, type Currency } from "@/lib/currency";

/** The quote form, prefilled from an engagement (and the currency the visitor is reading prices in). */
export const quoteHref = (e: Engagement, cur: Currency) => `/start?from=${e.id}&cur=${cur}`;

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

/**
 * The pricing page's engagements in three sections (consultation, development, as a service).
 * Choosing a card prints its slip; every card and the slip lead to the quote form.
 * `extras` adds content under a section, by group id (the "how it starts" rail under Development).
 */
export function ReceiptPricing({ extras = {} }: { extras?: Partial<Record<string, React.ReactNode>> }) {
  const [id, setId] = useState(ENGAGEMENTS[0].id);
  const guessed = useGuessedCurrency();
  const [chosen, setCur] = useState<Currency | null>(null);
  const cur = chosen ?? guessed;
  const [printed, setPrinted] = useState(0);

  const e = engagementById(id)!;
  const price = cur === "inr" ? e.inr : e.usd;
  const choose = (next: string) => {
    if (next === id) return;
    setId(next);
    setPrinted((n) => n + 1);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
      <div>
        <div className="flex items-center gap-3 text-sm">
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

        {ENGAGEMENT_GROUPS.map((g) => {
          const items = g.engagements.map((x) => engagementById(x)!);
          const note = "note" in g ? g.note : undefined;
          return (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="mt-12 scroll-mt-24 border-t border-ink/20 pt-8 first-of-type:mt-8">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-ink-3">{g.no}</span>
                <div>
                  <h2 id={`${g.id}-h`} className="serif text-4xl md:text-5xl">
                    {g.name}
                  </h2>
                  <p className="mt-1 text-ink-2">
                    <span className="label mr-2">Best for</span>
                    {g.bestFor}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {items.map((x) => (
                  <div key={x.id} className={`flex flex-col rounded-2xl border transition-colors ${x.id === id ? "border-ink bg-sheet" : "border-rule hover:border-ink-3"}`}>
                    <button onClick={() => choose(x.id)} aria-pressed={x.id === id} aria-controls="engagement-slip" className="flex-1 rounded-2xl p-5 text-left">
                      <span className="label">{x.timeline}</span>
                      <span className="serif mt-2 block text-3xl">{x.name}</span>
                      <span className="mt-1 block text-sm text-ink-2">{x.line}</span>
                      <span className="mt-3 block font-mono text-sm">
                        from {cur === "inr" ? x.inr : x.usd}
                        {x.per ? ` / ${x.per}` : ""}
                      </span>
                      <span className="sr-only">: show on the slip</span>
                    </button>
                    <Link
                      href={quoteHref(x, cur)}
                      className="mx-5 mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-ink/40 px-4 py-2 text-sm hover:bg-ink hover:text-paper"
                    >
                      Get a quote <span className="sr-only">for {x.name}</span>
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                ))}
                {note && (
                  <p className={`self-center text-sm text-ink-2 ${items.length === 1 ? "sm:px-4" : "sm:col-span-2"}`}>{note}</p>
                )}
              </div>
              {extras[g.id]}
            </section>
          );
        })}

        <p className="mt-10 max-w-xl text-sm text-ink-3">
          Prices are starting points for a typical scope, before GST where it applies. Every engagement is quoted in writing after an intro call, and
          the audit fee is credited if you go on to a build with us.
        </p>
      </div>

      <div className="lg:sticky lg:top-24">
        <div className="mx-auto h-3 w-[92%] rounded-full bg-ink/80" aria-hidden />
        <div id="engagement-slip" key={printed} className="receipt printing -mt-1.5 mx-auto w-[86%] px-6 pb-10 pt-7 font-mono text-[13px] text-ink" aria-live="polite">
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
          <p className="mt-3 text-center text-[11px] text-ink-3">FINAL QUOTE IN WRITING</p>
        </div>
        <Link
          href={quoteHref(e, cur)}
          className="mx-auto mt-6 flex w-[86%] items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-paper hover:bg-accent hover:text-accent-ink transition-colors"
        >
          Get a quote for this <span aria-hidden>→</span>
        </Link>
        <a href={SITE.calendly} target="_blank" rel="noopener" className="mt-3 block text-center text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
          Prefer a call? Book 20 minutes
        </a>
      </div>
    </div>
  );
}
