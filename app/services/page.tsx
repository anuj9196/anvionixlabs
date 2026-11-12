import type { Metadata } from "next";
import { SERVICES } from "@/data/site";
import { ServiceList } from "@/components/site/services";
import { ServiceDeck } from "@/components/site/synapse";
import { ProcessPath } from "@/components/site/process";
import { CallBand } from "@/components/site/footer";
import { JsonLd, breadcrumbLd } from "@/components/site/json-ld";

export const metadata: Metadata = {
  title: "Services: web, mobile, backend development and consulting",
  description:
    "Web app development in Next.js and React, Django backends and APIs, iOS and Android apps, and technical audits and fractional CTO services, from a founder-led studio in Delhi NCR.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div data-world="synapse">
      <section className="overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28">
        <div className="wrap text-center">
          <p className="label">Services</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
            Build beyond <span className="text-accent">the prototype.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-2">
            We design, build and run software end to end, or step in where you need us: a backend for your app, a mobile client for your platform, or an
            honest audit of what you already have.
          </p>
        </div>
        <div className="wrap mt-16">
          <ServiceDeck items={SERVICES} />
        </div>
      </section>
      <section className="wrap pb-16 md:pb-24">
        <p className="label mb-6">In detail</p>
        <ServiceList items={SERVICES} />
      </section>
      <section className="border-y border-rule bg-sheet/60">
        <div className="wrap py-16 md:py-24">
          <p className="label">How every engagement runs</p>
          <h2 className="serif mt-3 mb-12 text-4xl md:text-6xl">
            Five steps, <em>every time.</em>
          </h2>
          <ProcessPath />
        </div>
      </section>
      <CallBand />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
    </div>
  );
}
