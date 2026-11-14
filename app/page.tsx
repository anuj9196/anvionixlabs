import Link from "next/link";
import { EXPERIMENTS, FACTS, PROMISES, SERVICES, SITE } from "@/data/site";
import { DitherObject } from "@/components/site/dither";
import { GlyphStream, TypeText } from "@/components/site/glyphs";
import { BuildPrompt } from "@/components/site/prompt";
import { ExperimentLog } from "@/components/site/experiments";
import { ServiceList } from "@/components/site/services";
import { ProcessPath } from "@/components/site/process";

export const metadata = { alternates: { canonical: "/" } };

function SectionHead({ label, title, children }: { label: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="reveal mb-10 md:mb-14 grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
      <div>
        <p className="label">{label}</p>
        <h2 className="serif mt-3 text-4xl md:text-6xl leading-[1.02]">{title}</h2>
      </div>
      {children && <p className="text-ink-2 md:justify-self-end md:max-w-md">{children}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <div data-world="lacuna">
      {/* Hero, after Lacuna: a 1-bit world. The notebook breaks apart into pixels and letters while the headline is typed and corrected. */}
      <section className="relative overflow-hidden border-b border-rule">
        <div className="wrap grid gap-6 pt-10 pb-14 md:pt-16 md:pb-20 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="relative z-10">
            <p className="font-mono text-[13px] text-ink-3">[ A software studio for founders and teams ]</p>
            <h1 className="mt-6 font-mono text-[10.5vw] font-medium leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-[4.6rem]">
              <TypeText text="We build your " speed={55} />
              <del className="strike no-underline text-ink-3" style={{ ["--strike-at" as string]: "1900ms" }}>
                <TypeText text="prototype" start={770} speed={55} />
              </del>
              <br />
              <span className="text-accent">
                <TypeText text="product." start={2500} speed={70} caret />
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-ink-2">
              Web apps, mobile apps and backends for startups and brands, plus audits and a fractional CTO for teams that need senior judgement.
              Built like an experiment, shipped like a product, and kept running.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/start"
                className="border border-ink bg-ink px-5 py-3 font-mono text-[13px] uppercase tracking-[0.14em] text-paper shadow-[4px_4px_0_var(--accent)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--accent)]"
              >
                Start a project →
              </Link>
              <Link href="#work" className="font-mono text-[13px] uppercase tracking-[0.14em] underline decoration-ink-3 underline-offset-[6px] hover:text-accent">
                Read the log
              </Link>
            </div>
            <a href={SITE.calendly} target="_blank" rel="noopener" className="mt-5 inline-block font-mono text-[12px] text-ink-3 underline underline-offset-4 hover:text-ink">
              Prefer a call? Book {SITE.callMinutes} minutes
            </a>
            <nav aria-label="Live products" className="mt-12">
              <p className="font-mono text-[12px] text-ink-3">[ Live now ]</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[13px]">
                {EXPERIMENTS.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/work/${e.slug}`} className="flex items-center gap-2 text-ink-2 hover:text-ink">
                      <span className="h-1.5 w-1.5 bg-ok" aria-hidden />
                      {e.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <figure aria-hidden className="relative mx-auto -mt-4 w-full max-w-[640px] lg:mt-0">
            <div className="relative aspect-square">
              <div className="absolute inset-x-0 top-[8%] mx-auto w-[92%]">
                <DitherObject shape="book" res={240} dissolve clear />
              </div>
              <GlyphStream className="absolute inset-0" />
            </div>
            <figcaption className="absolute inset-x-0 bottom-2 flex justify-between font-mono text-[11px] text-ink-3">
              <span>Fig. 000</span>
              <span>Ideas, lifting off the page</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Facts that need no footnote */}
      <section aria-label="At a glance" className="border-y border-rule bg-sheet/60">
        <dl className="wrap grid grid-cols-2 md:grid-cols-4">
          {FACTS.map((f, i) => (
            <div key={f.label} className={`reveal py-7 md:py-9 ${i % 2 ? "pl-5 md:pl-8 border-l border-rule" : "md:pl-8 md:border-l md:border-rule md:first:border-l-0 md:first:pl-0"}`}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="font-mono text-4xl md:text-5xl">{f.value}</dd>
              <dd className="mt-1 text-sm text-ink-3">{f.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* The experiment log */}
      <section id="work" className="wrap scroll-mt-20 py-20 md:py-28">
        <SectionHead label="Experiment log" title={<>Five products, <em>all still running.</em></>}>
          Each one began as a question we could test. Four are our own products; one we built for a client. All of them are live.
        </SectionHead>
        <ExperimentLog items={EXPERIMENTS} />
      </section>

      {/* Services */}
      <section className="wrap py-20 md:py-28">
        <SectionHead label="What we do" title={<>Four ways <em>to work with us.</em></>}>
          The same team designs, builds, deploys and looks after it, so nothing gets lost between agencies.
        </SectionHead>
        <ServiceList items={SERVICES} />
      </section>

      {/* Method */}
      <section className="border-y border-rule bg-sheet/60">
        <div className="wrap py-20 md:py-28">
          <SectionHead label="Method" title={<>A procedure, <em>not a pitch.</em></>}>
            Every project follows the same five steps, whether it is a two-week audit or a six-month build.
          </SectionHead>
          <ProcessPath />
        </div>
      </section>

      {/* Promises instead of testimonials we do not have yet */}
      <section className="wrap py-20 md:py-28">
        <SectionHead label="Working with us" title={<>What you can <em>hold us to.</em></>} />
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p, i) => (
            <li key={p.h} className="reveal bg-sheet p-6 md:p-8">
              <span className="font-mono text-xs text-ink-3">0{i + 1}</span>
              <h3 className="serif mt-3 text-3xl leading-tight">{p.h}</h3>
              <p className="mt-3 text-sm text-ink-2">{p.p}</p>
            </li>
          ))}
        </ul>
        <p className="reveal mt-10 text-center">
          <Link href="/engage" className="font-medium underline hover:text-accent">
            See how we work together →
          </Link>
        </p>
      </section>

      <section aria-label="Start a project" className="border-t border-rule">
        <div className="wrap py-10 md:py-16">
          <BuildPrompt />
        </div>
      </section>
    </div>
  );
}
