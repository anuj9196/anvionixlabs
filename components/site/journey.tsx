"use client";

import { useEffect, useRef, useState } from "react";
import type { JourneyShape } from "@/data/site";
import { DitherObject } from "./dither";

type Step = { when: string; title: string; shape: JourneyShape; text: string };

/**
 * Career journey as a lab log: the object morphs as each step reaches the middle of the
 * screen, and that step's text streams in word by word. All text is in the page from the
 * start, for search engines and visitors without JavaScript.
 */
export function Journey({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = Array.from(list.current!.querySelectorAll<HTMLElement>("[data-step]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.step);
          setActive(i);
          setSeen((s) => Math.max(s, i));
          window.dispatchEvent(new Event("journey-step"));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="sticky top-16 z-10 self-start lg:top-24">
        {/* Phones: a compact bar that stays in view. Desktop: the full specimen card. */}
        <div className="flex items-center gap-4 rounded-2xl border border-rule bg-sheet p-3 lg:block lg:rounded-3xl lg:p-5">
          <div className="hidden items-center justify-between label lg:flex">
            <span>Log · {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" aria-hidden /> {steps[active].when}
            </span>
          </div>
          <div className="w-20 shrink-0 lg:mx-auto lg:mt-4 lg:w-auto lg:max-w-[360px]">
            <DitherObject shape={steps[active].shape} />
          </div>
          <div className="min-w-0 lg:mt-4 lg:text-center">
            <p className="label lg:hidden">
              {String(active + 1).padStart(2, "0")} · {steps[active].when}
            </p>
            <p className="serif text-xl lg:text-2xl">{steps[active].title}</p>
          </div>
        </div>
      </div>
      <ol ref={list} className="relative border-l border-rule pl-6 md:pl-8 lg:pb-[30vh]">
        {steps.map((s, i) => (
          <li
            key={s.title}
            data-step={i}
            className={`journey-step relative py-10 first:pt-0 md:py-16 ${i === active ? "active" : ""} ${i <= seen ? "seen" : ""}`}
          >
            <span
              aria-hidden
              className={`absolute -left-[31px] md:-left-[39px] top-1 h-3.5 w-3.5 rounded-full border transition-colors ${i <= seen ? "border-accent bg-accent" : "border-rule bg-paper"} ${i === 0 ? "" : "md:top-[4.1rem] top-[2.6rem]"}`}
            />
            <p className="label">
              {String(i + 1).padStart(2, "0")} · {s.when}
            </p>
            <h3 className="serif mt-2 text-3xl md:text-4xl">{s.title}</h3>
            <p className="mt-3 max-w-lg text-ink-2 leading-relaxed">
              {s.text.split(" ").map((w, j) => (
                <span key={j} className="w" style={{ ["--i" as string]: j }}>
                  {w}{" "}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
