import type { Metadata } from "next";
import { ENGAGEMENTS, PROMISES, START_STEPS } from "@/data/site";
import { StepRail } from "@/components/site/rail";
import { DitherObject } from "@/components/site/dither";
import { ReceiptPricing } from "@/components/site/receipt";
import { CallBand } from "@/components/site/footer";
import { JsonLd, breadcrumbLd } from "@/components/site/json-ld";

export const metadata: Metadata = {
  title: "Pricing: audits, MVP builds, retainers and fractional CTO",
  description:
    "Starting prices for working with Anvionix Labs: technical audits, fixed-scope MVP builds, monthly product retainers and fractional CTO, in INR and USD.",
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
              <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden /> Four engagements · prices in INR and USD
            </p>
            <h1 className="serif mt-6 text-6xl leading-[0.95] md:text-8xl">
              Pick a starting point. <em>We&apos;ll print the slip.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-2">
              Four ways to work together, each with an honest starting price. Choose one to see what it includes; the final quote comes in writing after a
              30-minute call.
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
        <div className="mt-12 md:mt-16">
          <h2 className="sr-only">How it starts</h2>
          <StepRail steps={START_STEPS} />
        </div>
      </section>
      <section id="slip" className="wrap scroll-mt-20 py-14 md:py-20">
        <ReceiptPricing />
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
            itemListElement: ENGAGEMENTS.map((e) => ({
              "@type": "Offer",
              name: e.name,
              description: e.scope.join("; "),
              priceSpecification: { "@type": "PriceSpecification", minPrice: Number(e.inr.replace(/[^\d]/g, "")), priceCurrency: "INR" },
            })),
          },
        ]}
      />
    </div>
  );
}
