import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ENGAGEMENTS, EXPERIMENTS, FIGURES, SERVICES, SITE, serviceBySlug } from "@/data/site";
import { Specimen } from "@/components/site/specimen";
import { CallBand } from "@/components/site/footer";
import { CallLink, QuoteButton } from "@/components/site/header";
import { JsonLd, breadcrumbLd, serviceLd } from "@/components/site/json-ld";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.short,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: s.title, description: s.short, url: `${SITE.url}/services/${s.slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const work = EXPERIMENTS.filter((e) => e.services.includes(s.slug));
  const engagements = s.slug === "consulting" ? ENGAGEMENTS.filter((e) => e.id === "audit" || e.id === "cto") : ENGAGEMENTS.filter((e) => e.id === "mvp" || e.id === "retainer");

  return (
    <div data-world="synapse">
      <section className="wrap pt-14 md:pt-24 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <nav aria-label="Breadcrumb" className="label">
            <Link href="/services" className="hover:text-ink">
              Services
            </Link>{" "}
            / {s.no}
          </nav>
          <h1 className="serif mt-4 text-5xl md:text-7xl leading-[0.98]">{s.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-2">{s.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <QuoteButton href={`/start?type=${s.slug === "consulting" ? "audit" : "mvp"}`} className="text-base !px-6 !py-3.5" />
            <CallLink />
          </div>
        </div>
        <Specimen shape={FIGURES[s.slug].shape} no={s.no} name={s.name} caption={FIGURES[s.slug].caption} className="mx-auto max-w-[520px]" />
      </section>

      <section className="wrap py-16 md:py-24 grid gap-12 lg:grid-cols-2">
        <div className="reveal">
          <p className="label">What it covers</p>
          <ul className="mt-5">
            {s.includes.map((x, i) => (
              <li key={x} className="flex gap-4 border-t border-rule py-4">
                <span className="font-mono text-xs text-ink-3 pt-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg">{x}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal">
          <div className="rounded-2xl mb-12 border border-rule bg-sheet p-6">
            <p className="label">Typical engagements</p>
            <ul className="mt-3">
              {engagements.map((e) => (
                <li key={e.id} className="flex items-baseline justify-between gap-4 border-t border-rule py-3">
                  <span>
                    <span className="font-medium">{e.name}</span>
                    <span className="block text-sm text-ink-3">{e.timeline}</span>
                  </span>
                  <Link href={`/start?from=${e.id}`} className="shrink-0 text-sm underline underline-offset-4 hover:text-accent">
                    Get a quote →
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/engage" className="mt-2 inline-block text-sm underline hover:text-accent">
              All engagements →
            </Link>
          </div>
          <p className="label">Tools we reach for</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {s.stack.map((t) => (
              <li key={t} className="rounded-full border border-rule bg-sheet px-4 py-2 font-mono text-sm">
                {t}
              </li>
            ))}
          </ul>
          {work.length > 0 && (
            <>
              <p className="label mt-12">In the experiment log</p>
              <ul className="mt-4">
                {work.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/work/${e.slug}`} className="group flex items-baseline gap-4 border-t border-rule py-4">
                      <span className="font-mono text-xs text-ink-3">{e.no}</span>
                      <span className="serif text-3xl group-hover:text-accent">{e.name}</span>
                      <span className="ml-auto text-sm text-ink-3 hidden sm:inline">{e.kind}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="border-y border-rule bg-sheet/60">
        <div className="wrap py-16 md:py-24 max-w-3xl">
          <p className="label">Questions</p>
          <h2 className="serif mt-3 text-4xl md:text-5xl">Before you ask</h2>
          <div className="mt-8">
            {s.faq.map((f) => (
              <details key={f.q} className="group border-t border-rule py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="text-ink-3 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CallBand />
      <JsonLd
        data={[
          ...serviceLd(s),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: s.name, path: `/services/${s.slug}` },
          ]),
        ]}
      />
    </div>
  );
}
