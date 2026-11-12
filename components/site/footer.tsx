import Link from "next/link";
import { EXPERIMENTS, SERVICES, SITE } from "@/data/site";
import { CallButton } from "./header";

export function CallBand() {
  return (
    <section className="wrap py-20 md:py-28">
      <div className="reveal rounded-3xl border border-rule bg-sheet p-8 md:p-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="label">Next experiment</p>
          <h2 className="serif text-4xl md:text-6xl mt-3 leading-[1.05]">
            Yours, <em>perhaps?</em>
          </h2>
          <p className="mt-4 max-w-xl text-ink-2">
            Tell us what you want to build or fix. A 30-minute call, and you leave with an honest view of the approach, timeline and cost.
          </p>
        </div>
        <div className="flex flex-col gap-3 shrink-0">
          <CallButton className="justify-center text-base !px-6 !py-3.5" />
          <a href={`mailto:${SITE.email}`} className="text-center text-sm text-ink-2 hover:text-ink">
            or write to {SITE.email}
          </a>
        </div>
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
              <a href={SITE.calendly} target="_blank" rel="noopener" className="hover:text-ink">
                Book an intro call
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

export { CallButton };
