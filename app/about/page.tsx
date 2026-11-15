import type { Metadata } from "next";
import Link from "next/link";
import { EXPERIMENTS, FOUNDER, SITE } from "@/data/site";
import { DepthPortrait } from "@/components/site/depth-portrait";
import { Journey } from "@/components/site/journey";
import { Stream, Thinking } from "@/components/site/thinking";
import { CallBand } from "@/components/site/footer";
import { JsonLd, breadcrumbLd } from "@/components/site/json-ld";

export const metadata: Metadata = {
  title: "About the lab and its founder, Anuj Sharma",
  description:
    "Anvionix Labs is a founder-led software studio in Ghaziabad, Delhi NCR. Founder Anuj Sharma has built production software since 2016 across Django, Next.js, Flutter and AWS.",
  alternates: { canonical: "/about" },
};

const THINKING = [
  { text: "Reading the CV, from the first commit in 2016", shape: "terminal" },
  { text: "Counting the team: 15+ engineers", shape: "book" },
  { text: "Checking what is live: five products", shape: "servers" },
  { text: "Noting the Engineering Excellence Award", shape: "trophy" },
] as const;

export default function AboutPage() {
  return (
    <div data-world="nightjar">
      {/* After Nightjar: ask who runs the lab, watch it think, read the answer. */}
      <section className="wrap pt-6 md:pt-10">
        <Thinking question={`Who runs ${SITE.name}?`} steps={[...THINKING]} final="network">
          <p className="text-[17px] leading-relaxed">
            <strong className="font-semibold">
              <Stream text={`${FOUNDER.name}, an engineering manager who leads a 15+ member engineering organisation.`} />
            </strong>{" "}
            <Stream text={FOUNDER.intro} from={14} />
          </p>
          {FOUNDER.story.map((p, i) => (
            <p key={i} className="mt-4 leading-relaxed text-ink-2">
              <Stream text={p} from={40 + i * 40} />
            </p>
          ))}
          <p className="ablock mt-7 font-medium" style={{ ["--i" as string]: 120 }}>
            The career, step by step:
          </p>
          <table className="ablock mt-3 w-full text-left text-sm" style={{ ["--i" as string]: 124 }}>
            <thead className="text-ink-3">
              <tr className="border-b border-rule">
                <th className="py-2 pr-4 font-medium">When</th>
                <th className="py-2 pr-4 font-medium">Step</th>
              </tr>
            </thead>
            <tbody>
              {FOUNDER.journey.map((j) => (
                <tr key={j.title} className="border-b border-rule">
                  <td className="py-2 pr-4 font-mono text-[13px] text-ink-3 whitespace-nowrap">{j.when}</td>
                  <td className="py-2 pr-4">{j.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ablock mt-5 text-sm text-ink-3" style={{ ["--i" as string]: 130 }}>
            {EXPERIMENTS.length} products live today ·{" "}
            <a href="#journey" className="underline hover:text-ink">
              read the full journey
            </a>
          </p>
        </Thinking>
      </section>

      <section id="founder" className="wrap scroll-mt-20 py-16 md:py-24 grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
        <div className="reveal lg:sticky lg:top-24">
          <DepthPortrait src={FOUNDER.photo} alt={`${FOUNDER.name}, founder of ${SITE.name}`} className="aspect-square rounded-3xl border border-rule bg-sheet" />
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
          <p className="label">The lab</p>
          <h2 className="serif mt-3 text-4xl md:text-6xl leading-[1.02]">
            A small lab <em>with real products</em> on the bench.
          </h2>
          <p className="mt-5 text-lg text-ink-2">
            {SITE.name} builds software for clients the same way it builds its own products: start from a question worth testing, ship it, measure it,
            and keep it running.
          </p>

          <div className="reveal mt-12">
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

      <section id="journey" className="border-y border-rule bg-sheet/40 scroll-mt-20">
        <div className="wrap py-16 md:py-24">
          <div className="reveal mb-12 max-w-2xl">
            <p className="label">Journey</p>
            <h2 className="serif mt-3 text-4xl md:text-6xl leading-[1.02]">
              From first commit <em>to leading the team.</em>
            </h2>
          </div>
          <Journey steps={FOUNDER.journey} />
        </div>
      </section>

      <section className="border-b border-rule bg-sheet/60">
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
    </div>
  );
}
