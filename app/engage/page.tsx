import type { Metadata } from "next";
import { ENGAGEMENTS, PROMISES, START_STEPS } from "@/data/site";
import { StepRail } from "@/components/site/rail";
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
    <>
      <section className="wrap pt-14 md:pt-24">
        <p className="label">Engagements</p>
        <h1 className="serif mt-4 text-6xl md:text-8xl leading-[0.95]">
          Pick a starting point. <em>We&apos;ll print the slip.</em>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-2">
          Four ways to work together, each with an honest starting price. Choose one to see what it includes; the final quote comes in writing after a
          30-minute call.
        </p>
        <div className="mt-14 border-t border-rule pt-10 md:mt-20">
          <p className="label mb-6">How it starts</p>
          <StepRail steps={START_STEPS} />
        </div>
      </section>
      <section className="wrap py-14 md:py-20">
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
    </>
  );
}
