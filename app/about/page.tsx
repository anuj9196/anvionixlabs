import type { Metadata } from "next";
import Link from "next/link";
import { EXPERIMENTS, FOUNDER, SITE } from "@/data/site";
import { DepthPortrait } from "@/components/site/depth-portrait";
import { CallBand } from "@/components/site/footer";
import { JsonLd, breadcrumbLd } from "@/components/site/json-ld";

export const metadata: Metadata = {
  title: "About the lab and its founder, Anuj Sharma",
  description:
    "Anvionix Labs is a founder-led software studio in Ghaziabad, Delhi NCR. Founder Anuj Sharma has built production software since 2016 across Django, Next.js, Flutter and AWS.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="wrap pt-14 md:pt-24">
        <p className="label">About the lab</p>
        <h1 className="serif mt-4 max-w-4xl text-6xl md:text-8xl leading-[0.95]">
          A small lab <em>with real products</em> on the bench.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-2">
          {SITE.name} builds software for clients the same way it builds its own products: start from a question worth testing, ship it, measure it,
          and keep it running. {EXPERIMENTS.length} of those products are live today.
        </p>
      </section>

      <section id="founder" className="wrap scroll-mt-20 py-16 md:py-24 grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
        <div className="reveal lg:sticky lg:top-24">
          <DepthPortrait priority src={FOUNDER.photo} alt={`${FOUNDER.name}, founder of ${SITE.name}`} className="aspect-square rounded-3xl border border-rule bg-sheet" />
          <p className="mt-4 font-medium">{FOUNDER.name}</p>
          <p className="text-sm text-ink-3">{FOUNDER.role}</p>
          <p className="mt-3 text-sm">
            <a href={SITE.social.linkedin} target="_blank" rel="noopener me" className="underline hover:text-accent">
              LinkedIn
            </a>
            {" · "}
            <a href={SITE.social.github} target="_blank" rel="noopener me" className="underline hover:text-accent">
              GitHub
            </a>
          </p>
        </div>
        <div className="max-w-2xl">
          <p className="label">Founder</p>
          <p className="serif mt-3 text-3xl md:text-4xl leading-snug">{FOUNDER.intro}</p>
          <div className="prose-lab mt-4">
            {FOUNDER.story.map((p, i) => (
              <p key={i} className="reveal">
                {p}
              </p>
            ))}
          </div>

          <div className="reveal mt-12">
            <p className="label">Previously</p>
            <ul className="mt-3">
              {FOUNDER.previously.map((p) => (
                <li key={p.name} className="border-t border-rule py-4">
                  <a href={p.url} target="_blank" rel="noopener" className="font-medium underline hover:text-accent">
                    {p.name}
                  </a>
                  <span className="block text-ink-2">{p.role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal mt-10">
            <p className="label">Recognition</p>
            <ul className="mt-3">
              {FOUNDER.awards.map((a) => (
                <li key={a} className="border-t border-rule py-3 text-ink-2">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal mt-10">
            <p className="label">Works in</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {FOUNDER.skills.map((s) => (
                <li key={s} className="rounded-full border border-rule bg-sheet px-3 py-1 font-mono text-xs">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal mt-10">
            <p className="label">Built and running</p>
            <ul className="mt-3">
              {EXPERIMENTS.map((e) => (
                <li key={e.slug}>
                  <Link href={`/work/${e.slug}`} className="group flex items-baseline gap-4 border-t border-rule py-3">
                    <span className="font-mono text-xs text-ink-3">{e.no}</span>
                    <span className="font-medium group-hover:text-accent">{e.name}</span>
                    <span className="ml-auto text-sm text-ink-3">{e.client ? `for ${e.client}` : "own product"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-rule bg-sheet/60">
        <div className="wrap py-16 md:py-20 grid gap-10 md:grid-cols-2">
          <div>
            <p className="label">Company details</p>
            <h2 className="serif mt-3 text-4xl">{SITE.legalName}</h2>
            <p className="mt-3 text-ink-2">
              A registered business in India, building software for clients worldwide. Satyakod is a brand of {SITE.legalName}.
            </p>
          </div>
          <dl className="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
            <dt className="label pt-0.5">Address</dt>
            <dd>
              {SITE.address.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </dd>
            <dt className="label pt-0.5">GSTIN</dt>
            <dd className="font-mono">{SITE.gstin}</dd>
            <dt className="label pt-0.5">Email</dt>
            <dd>
              <a href={`mailto:${SITE.email}`} className="underline">
                {SITE.email}
              </a>
            </dd>
            <dt className="label pt-0.5">Phone</dt>
            <dd>
              <a href={SITE.phoneHref} className="underline">
                {SITE.phone}
              </a>
            </dd>
          </dl>
        </div>
      </section>

      <CallBand />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${SITE.url}/about#founder`,
            name: FOUNDER.name,
            jobTitle: "Founder",
            worksFor: { "@id": `${SITE.url}/#organization` },
            image: `${SITE.url}${FOUNDER.photo}`,
            sameAs: [SITE.social.linkedin, SITE.social.github],
            knowsAbout: FOUNDER.skills,
          },
        ]}
      />
    </>
  );
}
