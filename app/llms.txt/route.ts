import { ENGAGEMENT_GROUPS, EXPERIMENTS, FOUNDER, QUOTE, SERVICES, SITE, START_PATH, engagementById } from "@/data/site";

export const dynamic = "force-static";

/** A plain-text summary for AI assistants (llms.txt), built from the same data as the pages. */
export function GET() {
  const u = (path: string) => `${SITE.url}${path}`;
  const text = `# ${SITE.name}

> ${SITE.description}

Founder-led software studio in ${SITE.address.locality}, Delhi NCR, India, working with clients worldwide. Founded and led by ${FOUNDER.name}, an engineering manager who leads a 15+ member engineering organisation. Every engagement starts with a short brief or an intro call; the final quote is given in writing.

- Get a quote (send a brief; reply ${QUOTE.replyTime}): ${u("/start")}
- Prefer a call: ${SITE.calendly}
- Email: ${SITE.email}
- Phone: ${SITE.phone}

## Services

${SERVICES.map((s) => `- [${s.name}](${u(`/services/${s.slug}`)}): ${s.short}`).join("\n")}

## Engagements and starting prices

${ENGAGEMENT_GROUPS.map(
  (g) =>
    `### ${g.name}\n\nBest for: ${g.bestFor}${"note" in g ? ` ${g.note}` : ""}\n\n${g.engagements
      .map((id) => engagementById(id)!)
      .map((e) => `- ${e.name}: from ${e.inr} or ${e.usd}${e.per ? ` a ${e.per}` : ""} (${e.timeline})`)
      .join("\n")}`,
).join("\n\n")}

Most teams start here: ${START_PATH.map((id) => engagementById(id)!.name).join(" → ")}.

Details: ${u("/engage")}

## Our products (not part of client services)

${SITE.brands.map((b) => `- [${b.name}](${b.url}): ${b.about}`).join("\n")}

## Work (live products)

${EXPERIMENTS.map((e) => `- [${e.name}](${u(`/work/${e.slug}`)}): ${e.kind}${e.client ? `, built for ${e.client}` : ""}. ${e.summary}`).join("\n")}

## About

- [Founder and company](${u("/about")})
- Legal name: ${SITE.legalName}, GSTIN ${SITE.gstin}
- Address: ${SITE.address.lines.join(", ")}
`;
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
