"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TARGETS = ".reveal, .uncover, .draw, .focus-target";

/**
 * Fallback for browsers without scroll-driven animations, and the trigger for the
 * focus effect everywhere: marks elements `.in` / `.focused` once they are on screen.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in", "focused"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add(e.target.classList.contains("focus-target") ? "focused" : "in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}

/** A heading whose words come into focus one after another. */
export function FocusText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`focus-target ${className ?? ""}`}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="focus-word" style={{ ["--i" as string]: i }}>
          {w}
          {" "}
        </span>
      ))}
    </span>
  );
}
