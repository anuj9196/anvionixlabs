import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EXPERIMENTS, FIGURES, SERVICES, SITE, experimentBySlug } from "@/data/site";
import { Specimen } from "@/components/site/specimen";
import { CallBand } from "@/components/site/footer";
import { JsonLd, breadcrumbLd } from "@/components/site/json-ld";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return EXPERIMENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = experimentBySlug((await params).slug);
  if (!e) return {};
  const title = `${e.name}: ${e.kind.toLowerCase()} case study`;
  return {
    title,
    description: e.summary,
    alternates: { canonical: `/work/${e.slug}` },
    openGraph: { title, description: e.summary, url: `${SITE.url}/work/${e.slug}`, images: [e.image], type: "article" },
  };
}

export default async function WorkPage({ params }: Props) {
  const e = experimentBySlug((await params).slug);
  if (!e) notFound();
  const i = EXPERIMENTS.indexOf(e);
  const next = EXPERIMENTS[(i + 1) % EXPERIMENTS.length];
  const services = SERVICES.filter((s) => e.services.includes(s.slug));

  return (
    <>
      <article>
        <header className="wrap pt-12 md:pt-20 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="label">
              <Link href="/#work" className="hover:text-ink">
                Experiment log
              </Link>{" "}
              / {e.no}
            </nav>
            <h1 className="serif mt-5 text-6xl md:text-8xl leading-[0.95]">{e.name}</h1>
            <p className="mt-4 label">
              {e.kind}
              {e.client ? ` · built for ${e.client}` : " · our product"}
            </p>
            <p className="mt-6 max-w-2xl text-xl text-ink-2">{e.summary}</p>
            {e.url && (
              <a href={e.url} target="_blank" rel="noopener" className="mt-6 inline-block font-medium underline hover:text-accent">
                Visit {e.urlLabel} →
              </a>
            )}
          </div>
          <Specimen shape={FIGURES[e.slug].shape} no={e.no} name={e.kind} caption={FIGURES[e.slug].caption} className="mx-auto hidden max-w-[460px] sm:block" />
        </header>

        <div className="wrap mt-12">
          <div className="uncover overflow-hidden rounded-3xl border border-rule bg-sheet">
            <Image src={e.image} alt={e.imageAlt} width={1456} height={834} priority sizes="(min-width: 1180px) 1116px, 100vw" className="h-auto w-full" />
          </div>
        </div>

        <div className="wrap mt-14 grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="max-w-2xl">
            <section className="reveal">
              <p className="label">Problem</p>
              <p className="mt-3 text-xl leading-relaxed">{e.problem}</p>
            </section>
            <section className="reveal mt-10">
              <p className="label">Hypothesis</p>
              <p className="serif mt-3 text-3xl leading-snug">
                <em>{e.hypothesis}</em>
              </p>
            </section>
            <section className="reveal mt-10">
              <p className="label">What we built</p>
              <ul className="mt-4 space-y-3">
                {e.build.map((b) => (
                  <li key={b} className="flex gap-3 border-t border-rule pt-3 text-ink-2">
                    <span className="text-accent" aria-hidden>
                      +
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </section>
            {e.report.map((r) => (
              <section key={r.h} className="reveal mt-12 prose-lab">
                <h2 className="serif text-3xl md:text-4xl">{r.h}</h2>
                {r.p.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </section>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 self-start space-y-6">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-rule bg-rule">
              {e.results.map((r) => (
                <div key={r.label} className="bg-sheet p-4">
                  <dt className="label">{r.label}</dt>
                  <dd className="mt-1 font-mono text-xl">{r.value}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-2xl border border-rule bg-sheet p-5">
              <p className="label">Stack</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {e.stack.map((s) => (
                  <li key={s} className="rounded-full border border-rule px-3 py-1 font-mono text-xs">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-rule bg-sheet p-5">
              <p className="label">Related services</p>
              <ul className="mt-3 space-y-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="underline hover:text-accent">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>

      <nav aria-label="Next experiment" className="wrap mt-20">
        <Link href={`/work/${next.slug}`} className="group flex items-baseline justify-between gap-6 border-y border-rule py-8">
          <span className="label">Next · {next.no}</span>
          <span className="serif text-4xl md:text-6xl group-hover:text-accent">{next.name} →</span>
        </Link>
      </nav>
      <CallBand />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Work", path: "/#work" },
            { name: e.name, path: `/work/${e.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: `${e.name} case study`,
            about: { "@type": "SoftwareApplication", name: e.name, url: e.url, applicationCategory: e.kind },
            creator: { "@id": `${SITE.url}/#organization` },
            url: `${SITE.url}/work/${e.slug}`,
            image: `${SITE.url}${e.image}`,
          },
        ]}
      />
    </>
  );
}
