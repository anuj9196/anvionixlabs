import type { Metadata } from "next";
import { QUOTE, SITE } from "@/data/site";
import { QuotePageForm } from "@/components/site/quote-page-form";
import { JsonLd, breadcrumbLd } from "@/components/site/json-ld";

export const metadata: Metadata = {
  title: "Get a quote: tell us what you are building",
  description:
    "Send Anvionix Labs a short brief: what you are building, where it is today, budget and timing. We reply within one business day with next steps and a scoping call.",
  alternates: { canonical: "/start" },
};

const NEXT = [
  { h: "We read it", p: `A reply ${QUOTE.replyTime}, from ${SITE.email}, with any questions we have.` },
  { h: "A free scoping call", p: "We agree what is in and out, and what success looks like." },
  { h: "A written quote", p: "Scope, timeline and a fixed price, before anything is built." },
];

/** After Mobula: deep night-blue, the brief on one sheet, what happens next beside it. */
export default function StartPage() {
  return (
    <div data-world="mobula">
      <section className="wrap grid gap-10 py-12 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="label">New experiment · Get a quote</p>
          <h1 className="serif mt-4 text-5xl leading-none md:text-7xl">
            What are you <em>building?</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-2">
            Tell us the problem, not the spec. Two minutes here saves a round of emails, and lets our first reply get straight to approach and cost.
          </p>
          <ol className="mt-10 space-y-5">
            {NEXT.map((n, i) => (
              <li key={n.h} className="flex gap-4">
                <span className="font-mono text-xs text-ink-3 pt-1">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-medium">{n.h}</span>
                  <span className="block text-sm text-ink-2">{n.p}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-10 font-mono text-[12px] text-ink-3">
            Prefer writing? <a href={`mailto:${SITE.email}`} className="underline hover:text-ink">{SITE.email}</a> · {SITE.phone}
          </p>
        </div>
        <QuotePageForm />
      </section>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Get a quote", path: "/start" },
          ]),
          { "@context": "https://schema.org", "@type": "ContactPage", name: "Get a quote", url: `${SITE.url}/start`, about: { "@id": `${SITE.url}/#organization` } },
        ]}
      />
    </div>
  );
}
