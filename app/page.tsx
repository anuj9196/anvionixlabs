import Link from "next/link";
import { EXPERIMENTS, FACTS, PROMISES, SERVICES } from "@/data/site";
import { DitherObject } from "@/components/site/dither";
import { GlyphStream, TypeText } from "@/components/site/glyphs";
import { CallButton } from "@/components/site/header";
import { CallBand } from "@/components/site/footer";
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
    <>
      {/* Hero: the notebook's title page. A dithered notebook sheds code and lab words while the headline types. */}
      <section className="wrap pt-12 pb-16 md:pt-20 md:pb-24 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <p className="label">Software studio · Delhi NCR · Working worldwide</p>
          <h1 className="serif mt-5 text-[12.5vw] leading-[0.95] sm:text-6xl md:text-7xl lg:text-[5.4rem]">
            <TypeText text="We build software like an experiment," speed={28} />{" "}
            <em className="text-accent">
              <TypeText text="and ship it like a product." start={1100} speed={30} caret />
            </em>
          </h1>
          <p className="reveal mt-7 max-w-xl text-lg text-ink-2">
            Web apps, mobile apps and backends for startups and brands, plus audits and a fractional CTO for teams that need senior judgement. Every
            build starts with a hypothesis and ends with something live.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <CallButton className="text-base !px-6 !py-3.5" />
            <Link href="#work" className="text-sm font-medium underline hover:text-accent">
              See the experiments
            </Link>
          </div>
          <nav aria-label="Live products" className="mt-10">
            <p className="label">Live now</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {EXPERIMENTS.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/work/${e.slug}`}
                    className="flex items-center gap-2 rounded-full border border-rule bg-sheet px-3 py-1.5 text-sm hover:border-ink-3"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <figure aria-hidden className="relative mx-auto w-full max-w-[520px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-rule bg-sheet">
            <div className="absolute inset-x-0 top-[22%] mx-auto w-[86%]">
              <DitherObject shape="book" res={220} />
            </div>
            <GlyphStream className="absolute inset-0" />
            <div className="absolute inset-x-5 top-4 flex justify-between label">
              <span>Specimen · 000</span>
              <span>Lab notebook</span>
            </div>
            <div className="absolute inset-x-5 bottom-4 flex justify-between label">
              <span>Fig. 1</span>
              <span>Ideas, lifting off the page</span>
            </div>
          </div>
        </figure>
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
            See engagements and starting prices →
          </Link>
        </p>
      </section>

      <CallBand />
    </>
  );
}
