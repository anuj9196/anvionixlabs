import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BOOKS, EXPERIMENTS, SERVICES, SITE, experimentBySlug } from "@/data/site";
import { CaseBook } from "@/components/site/case-book";
import { Gauge } from "@/components/site/gauge";
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
  // The hardware app gets a meter, like the tester it drives, reading its real Play Store rating.
  const rating = e.results.find((r) => r.label === "Google Play rating");
  const gauge = rating ? { value: parseFloat(rating.value) } : null;

  return (
    <div data-world="linen" style={{ ["--book" as string]: BOOKS[e.slug] }}>
      <article>
        <header className="wrap pt-10 text-center md:pt-14">
          <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            <Link href="/#work" className="hover:text-ink">
              Experiment log
            </Link>{" "}
            / {e.no}
          </nav>
          <h1 className="serif mt-3 text-5xl md:text-7xl leading-[0.95]">
            <em>{e.name}</em>
          </h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            {e.kind}
            {e.client ? ` · built for ${e.client}` : " · our product"}
          </p>
        </header>

        <div className="wrap mt-6 lg:mt-0">
          <CaseBook e={e} color={BOOKS[e.slug]} />
        </div>

        <div className="wrap mt-8 text-center lg:-mt-10">
          <p className="mx-auto max-w-2xl serif text-2xl md:text-3xl leading-snug">{e.summary}</p>
          {e.url && (
            <a href={e.url} target="_blank" rel="noopener" className="mt-5 inline-block font-mono text-[12px] uppercase tracking-[0.16em] underline underline-offset-[6px] hover:text-accent">
              Visit {e.urlLabel} →
            </a>
          )}
        </div>

        {gauge && (
          <div className="wrap mt-16">
            <Gauge value={gauge.value} max={5} unit="★" label="Google Play rating" rows={e.results} />
          </div>
        )}

        <div className="wrap mt-14 grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="max-w-2xl">
            <section className="reveal">
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
    </div>
  );
}
