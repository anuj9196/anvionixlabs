import Link from "next/link";
import { EXPERIMENTS, FACTS, PROMISES, SERVICES } from "@/data/site";
import { FocusText } from "@/components/site/reveal";
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
      {/* Hero: the notebook's title page */}
      <section className="wrap pt-14 pb-16 md:pt-24 md:pb-24 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <p className="label">Software studio · Delhi NCR · Working worldwide</p>
          <h1 className="serif mt-5 text-[13vw] leading-[0.95] sm:text-6xl md:text-7xl lg:text-[5.6rem]">
            <FocusText text="We build software like an experiment," />
            <em className="text-accent">
              <FocusText text="and ship it like a product." />
            </em>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-ink-2">
            Web apps, mobile apps and backends for startups and brands, plus audits and a fractional CTO for teams that need senior judgement. Every
            build starts with a hypothesis and ends with something live.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <CallButton className="text-base !px-6 !py-3.5" />
            <Link href="#work" className="text-sm font-medium underline hover:text-accent">
              See the experiments
            </Link>
          </div>
        </div>

        <aside aria-label="Contents" className="reveal rounded-2xl border border-rule bg-sheet p-5 md:p-6">
          <p className="label flex justify-between">
            <span>Notebook · Contents</span>
            <span>Status</span>
          </p>
          <ol className="mt-3">
            {EXPERIMENTS.map((e) => (
              <li key={e.slug}>
                <Link href={`/work/${e.slug}`} className="group flex items-baseline gap-3 border-t border-rule py-3 text-sm">
                  <span className="font-mono text-ink-3">{e.no}</span>
                  <span className="font-medium group-hover:text-accent">{e.name}</span>
                  <span className="hidden sm:inline text-ink-3 truncate">{e.kind}</span>
                  <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-ok">
                    <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" aria-hidden />
                    LIVE
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
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
