import { ENGAGEMENTS, EXPERIMENTS, FOUNDER, SERVICES, SITE } from "@/data/site";

export const dynamic = "force-static";

/** A plain-text summary for AI assistants (llms.txt), built from the same data as the pages. */
export function GET() {
  const u = (path: string) => `${SITE.url}${path}`;
  const text = `# ${SITE.name}

> ${SITE.description}

Founder-led software studio in ${SITE.address.locality}, Delhi NCR, India, working with clients worldwide. Founded and led by ${FOUNDER.name}, an engineering manager who leads a 15+ member engineering organisation. Every engagement starts with a 30-minute intro call; the final quote is given in writing.

- Book an intro call: ${SITE.calendly}
- Email: ${SITE.email}
- Phone: ${SITE.phone}

## Services

${SERVICES.map((s) => `- [${s.name}](${u(`/services/${s.slug}`)}): ${s.short}`).join("\n")}

## Engagements and starting prices

${ENGAGEMENTS.map((e) => `- ${e.name}: from ${e.inr} or ${e.usd} (${e.timeline})`).join("\n")}

Details: ${u("/engage")}

## Work (live products)

${EXPERIMENTS.map((e) => `- [${e.name}](${u(`/work/${e.slug}`)}): ${e.kind}${e.client ? `, built for ${e.client}` : ""}. ${e.summary}`).join("\n")}

## About

- [Founder and company](${u("/about")})
- Legal name: ${SITE.legalName}, GSTIN ${SITE.gstin}
- Address: ${SITE.address.lines.join(", ")}
`;
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
