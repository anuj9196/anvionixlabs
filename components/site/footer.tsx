import Link from "next/link";
import { EXPERIMENTS, SERVICES, SITE } from "@/data/site";
import { CallLink, QuoteButton } from "./header";
import { BeaconParticles } from "./beacon";

/** The closing band on every page, after Beacon: a column of blue light rising behind the call to action. */
export function CallBand() {
  return (
    <section data-world="beacon" className="relative isolate overflow-hidden bg-paper">
      <div aria-hidden className="beacon-column pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-[min(520px,90vw)] -translate-x-1/2" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(60%_80%_at_50%_100%,rgba(84,110,255,.35),transparent_70%)]" />
      <BeaconParticles />
      <div className="wrap relative flex flex-col items-center py-24 text-center md:py-36">
        <p className="inline-flex items-center gap-2 rounded-full border border-rule bg-sheet/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden /> Next experiment
        </p>
        <h2 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">
          Yours, <span className="serif font-normal italic">perhaps?</span>
        </h2>
        <p className="mt-5 max-w-xl text-ink-2">
          Tell us what you want to build or fix. We reply within one business day, and a free {SITE.callMinutes}-minute call gives you an honest view of the approach,
          timeline and cost.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/start"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-paper shadow-[0_0_40px_rgba(142,162,255,.45)] transition-shadow hover:shadow-[0_0_60px_rgba(142,162,255,.7)]"
          >
            Get a quote <span aria-hidden>→</span>
          </Link>
          <CallLink />
        </div>
        <ul className="mt-12 flex flex-wrap justify-center gap-3 text-xs text-ink-2">
          {[`Free ${SITE.callMinutes}-minute call`, "Written quote", "Weekly demos", "Code in your accounts"].map((c) => (
            <li key={c} className="rounded-full border border-rule bg-sheet/50 px-3 py-1.5 backdrop-blur">
              {c}
            </li>
          ))}
        </ul>
        <a href={`mailto:${SITE.email}`} className="mt-8 font-mono text-[12px] text-ink-3 hover:text-ink">
          {SITE.email}
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-rule mt-auto overflow-hidden">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div>
          <p className="label mb-4">Services</p>
          <ul className="space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-ink-2 hover:text-ink">
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/engage" className="text-ink-2 hover:text-ink">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="label mb-4">Work</p>
          <ul className="space-y-2.5">
            {EXPERIMENTS.map((e) => (
              <li key={e.slug}>
                <Link href={`/work/${e.slug}`} className="text-ink-2 hover:text-ink">
                  {e.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-4">Contact</p>
          <ul className="space-y-2.5 text-ink-2">
            <li>
              <Link href="/start" className="hover:text-ink">
                Get a quote
              </Link>
            </li>
            <li>
              <a href={SITE.calendly} target="_blank" rel="noopener" className="hover:text-ink">
                Book a {SITE.callMinutes}-minute intro call
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-ink">
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.phoneHref} className="hover:text-ink">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.social.linkedin} target="_blank" rel="noopener me" className="hover:text-ink">
                LinkedIn
              </a>
              {" · "}
              <a href={SITE.social.github} target="_blank" rel="noopener me" className="hover:text-ink">
                GitHub
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="label mb-4">Company</p>
          <address className="not-italic text-ink-2 leading-relaxed">
            {SITE.legalName}
            <br />
            {SITE.address.lines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
            <span className="block mt-2">GSTIN {SITE.gstin}</span>
          </address>
          <p className="mt-3 text-ink-2">
            Our brands:{" "}
            {SITE.brands.map((b) => (
              <a key={b.url} href={b.url} className="font-medium text-ink hover:text-accent">
                {b.name}
              </a>
            ))}
          </p>
        </div>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-3 border-t border-rule py-5 text-xs text-ink-3">
        <p>
          © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
        </p>
        <Link href="/about" className="hover:text-ink">
          About the lab
        </Link>
      </div>
      <p aria-hidden className="select-none whitespace-nowrap font-mono font-semibold uppercase leading-[0.78] tracking-[-0.04em] text-ink/[0.06] text-[17vw] -mb-[3vw] text-center">
        Anvionix/Labs
      </p>
    </footer>
  );
}

export { QuoteButton };
