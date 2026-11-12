import Link from "next/link";
import type { Service } from "@/data/site";

/** Big numbered list: a row opens on hover (or always, on touch screens) to show what it covers. */
export function ServiceList({ items }: { items: Service[] }) {
  return (
    <ul className="border-b border-rule">
      {items.map((s) => (
        <li key={s.slug} className="reveal border-t border-rule">
          <Link href={`/services/${s.slug}`} className="group grid grid-cols-[48px_1fr_auto] items-baseline gap-4 py-6 md:grid-cols-[90px_1fr_auto] md:py-8">
            <span className="font-mono text-sm text-ink-3">{s.no}</span>
            <span>
              <span className="serif block text-4xl md:text-6xl leading-none transition-colors group-hover:text-accent">{s.name}</span>
              <span className="grid transition-[grid-template-rows] duration-500 ease-out [grid-template-rows:1fr] md:[grid-template-rows:0fr] md:group-hover:[grid-template-rows:1fr] md:group-focus-visible:[grid-template-rows:1fr]">
                <span className="overflow-hidden">
                  <span className="block pt-4 max-w-2xl text-ink-2">{s.short}</span>
                  <span className="block pt-3 font-mono text-xs text-ink-3">{s.stack.join(" · ")}</span>
                </span>
              </span>
            </span>
            <span aria-hidden className="text-2xl text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-accent">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
