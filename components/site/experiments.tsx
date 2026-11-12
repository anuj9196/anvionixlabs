import Image from "next/image";
import Link from "next/link";
import type { Experiment } from "@/data/site";

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-4 border-t border-rule py-3 md:grid-cols-[120px_1fr]">
      <dt className="label pt-0.5">{k}</dt>
      <dd className="text-[15px] leading-relaxed text-ink-2">{children}</dd>
    </div>
  );
}

/** One experiment written up as a lab report card. */
export function ExperimentCard({ e, index }: { e: Experiment; index: number }) {
  return (
    <article
      className="[@media(min-width:1024px)_and_(min-height:760px)]:sticky [@media(min-width:1024px)_and_(min-height:760px)]:min-h-[min(calc(100dvh-140px),700px)] content-center rounded-3xl border border-rule bg-sheet p-5 md:p-9 shadow-[0_-12px_40px_-28px_rgba(0,0,0,.35)] grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center"
      style={{ top: `${80 + index * 14}px` }}
    >
      <div>
        <p className="label">
          Experiment {e.no} · {e.kind}
          {e.client ? ` · for ${e.client}` : ""}
        </p>
        <h3 className="serif mt-3 text-5xl md:text-6xl leading-none">{e.name}</h3>
        <p className="mt-4 text-ink-2 max-w-lg">{e.summary}</p>
        <dl className="mt-6">
          <Row k="Problem">{e.problem}</Row>
          <Row k="Hypothesis">{e.hypothesis}</Row>
          <Row k="Built with">
            <span className="font-mono text-[13px]">{e.stack.join(" · ")}</span>
          </Row>
        </dl>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={`/work/${e.slug}`} className="rounded-full border border-ink px-5 py-2.5 text-sm font-medium hover:bg-ink hover:text-paper transition-colors">
            Read the report →
          </Link>
          {e.url && (
            <a href={e.url} target="_blank" rel="noopener" className="text-sm text-ink-2 underline hover:text-ink">
              {e.urlLabel}
            </a>
          )}
        </div>
      </div>
      <div>
        <div className="overflow-hidden rounded-2xl border border-rule bg-paper">
          <Image src={e.image} alt={e.imageAlt} width={1456} height={834} sizes="(min-width: 1024px) 520px, 100vw" className="h-auto w-full" />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-rule bg-rule">
          {e.results.map((r) => (
            <div key={r.label} className="bg-sheet p-4">
              <dt className="label">{r.label}</dt>
              <dd className="mt-1 font-mono text-xl md:text-2xl text-ink">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export function ExperimentLog({ items }: { items: Experiment[] }) {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      {items.map((e, i) => (
        <ExperimentCard key={e.slug} e={e} index={i} />
      ))}
    </div>
  );
}
