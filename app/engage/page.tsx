import type { Metadata } from "next";
import Link from "next/link";
import { ENGAGEMENT_GROUPS, PROMISES, SITE, START_PATH, START_STEPS, engagementById } from "@/data/site";
import { StepRail } from "@/components/site/rail";
import { DitherObject } from "@/components/site/dither";
import { ReceiptPricing } from "@/components/site/receipt";
import { CallBand } from "@/components/site/footer";
import { JsonLd, breadcrumbLd } from "@/components/site/json-ld";

export const metadata: Metadata = {
  title: "Pricing: consultation, development and product teams as a service",
  description:
    "Starting prices for working with Anvionix Labs: technical audits and fractional CTO, fixed-scope MVP builds, and monthly product retainers, in INR and USD.",
  alternates: { canonical: "/engage" },
};

export default function EngagePage() {
  return (
    <div data-world="zephyr">
      {/* After Zephyr: sage haze, a serif headline with an italic turn, an object floating, and the steps along the floor. */}
      <section className="wrap pt-10 pb-12 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-sheet/40 px-3 py-1.5 text-xs text-ink-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden /> Consultation · Development · As a service
            </p>
            <h1 className="serif mt-6 text-6xl leading-[0.95] md:text-8xl">
              Pick a starting point. <em>We&apos;ll print the slip.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-2">
              Senior advice, a product built to a fixed price, or a team that keeps it running: each with an honest starting price. Choose one to see what
              it includes; the final quote comes in writing after a free scoping call.
            </p>
            <a href="#slip" className="mt-8 inline-flex items-center gap-3 rounded-full border border-ink/30 py-2 pl-2 pr-5 text-xs font-medium uppercase tracking-[0.14em] hover:bg-ink hover:text-paper">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper" aria-hidden>
                ↓
              </span>
              See the prices
            </a>
          </div>
          <figure aria-hidden className="relative mx-auto w-full max-w-[460px]">
            <div className="float">
              <DitherObject shape="form" res={200} clear />
            </div>
            <div className="float-shadow mx-auto -mt-4 h-6 w-2/3 rounded-[50%] bg-ink/25 blur-xl" />
          </figure>
        </div>
        <nav aria-labelledby="start-path" className="mt-12 md:mt-16">
          <p id="start-path" className="label">
            Most teams start here
          </p>
          <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {START_PATH.map((id, i) => {
              const e = engagementById(id)!;
              const group = ENGAGEMENT_GROUPS.find((g) => (g.engagements as readonly string[]).includes(id))!;
              return (
                <li key={id} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-ink-3">→</span>}
                  <a href={`#${group.id}`} className="rounded-full border border-ink/15 bg-sheet/45 px-4 py-2 backdrop-blur-sm hover:border-ink/40">
                    <span className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span> {e.name}
                  </a>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 max-w-xl text-sm text-ink-2">
            An audit to see what you have, a build to a fixed price, then a retainer to keep it moving. Start at any step.
          </p>
        </nav>
      </section>
      <section id="slip" className="wrap scroll-mt-20 pb-14 md:pb-20">
        <ReceiptPricing
          extras={{
            development: (
              <div className="mt-8">
                <h3 className="label mb-4">How an engagement starts</h3>
                <StepRail steps={START_STEPS} />
              </div>
            ),
          }}
        />
      </section>
      <section aria-labelledby="our-products" className="wrap pb-14 md:pb-20">
        <div className="rounded-3xl border border-dashed border-ink/30 p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div>
            <h2 id="our-products" className="label">
              Our products · not part of client services
            </h2>
            {SITE.brands.map((b) => (
              <p key={b.url} className="mt-3 text-ink-2">
                <span className="serif text-3xl text-ink">{b.name}</span> <span className="ml-1">{b.about}</span>
              </p>
            ))}
          </div>
          {SITE.brands.map((b) => (
            <a key={b.url} href={b.url} target="_blank" rel="noopener" className="mt-5 inline-flex shrink-0 items-center gap-2 text-sm font-medium underline underline-offset-4 hover:text-ink-2 md:mt-0">
              {b.url.replace("https://", "")} <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-3">
          Not sure which fits? <Link href="/start" className="underline hover:text-ink">Send us a short brief</Link> and we will suggest one.
        </p>
      </section>
      <section className="border-y border-rule bg-sheet/60">
        <div className="wrap py-16 md:py-24">
          <p className="label">Whichever you choose</p>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map((p) => (
              <li key={p.h} className="reveal bg-sheet p-6">
                <h2 className="serif text-2xl">{p.h}</h2>
                <p className="mt-2 text-sm text-ink-2">{p.p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CallBand />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/engage" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: "Anvionix Labs engagements",
            itemListElement: ENGAGEMENT_GROUPS.map((g) => ({
              "@type": "OfferCatalog",
              name: g.name,
              description: g.bestFor,
              itemListElement: g.engagements.map((id) => {
                const e = engagementById(id)!;
                return {
                  "@type": "Offer",
                  name: e.name,
                  description: e.scope.join("; "),
                  url: `${SITE.url}/engage#${g.id}`,
                  priceSpecification: [
                    { "@type": "PriceSpecification", minPrice: Number(e.inr.replace(/[^\d]/g, "")), priceCurrency: "INR" },
                    { "@type": "PriceSpecification", minPrice: Number(e.usd.replace(/[^\d]/g, "")), priceCurrency: "USD" },
                  ].map((p) => (e.per ? { ...p, "@type": "UnitPriceSpecification", unitText: e.per.toUpperCase() } : p)),
                };
              }),
            })),
          },
        ]}
      />
    </div>
  );
}
