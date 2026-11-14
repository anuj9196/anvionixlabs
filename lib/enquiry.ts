import { QUOTE, SITE, type Budget, type ProjectType, type Stage, type Timeline } from "@/data/site";
import type { Currency } from "@/lib/currency";

/** What the visitor typed into the quote form. */
export type QuoteAnswers = {
  projectType: ProjectType | "";
  message: string;
  stage: Stage | "";
  budget: Budget | "";
  timeline: Timeline | "";
  name: string;
  email: string;
  company: string;
  link: string;
  /** Honeypot: hidden from people, filled by bots. */
  website: string;
};

export type QuoteField = Exclude<keyof QuoteAnswers, "website">;

/**
 * The one place that turns the form into the API's body (contract: qidentity
 * docs/internal/website-enquiries.md). `website` is the honeypot and `elapsed_ms` the timing
 * trap (the API quietly drops a form sent within a few seconds of the page opening, as bots do).
 */
const PROJECT_TYPE: Record<ProjectType, string> = { mvp: "new_product", existing: "existing_product", audit: "audit", team: "team" };

export function toEnquiryPayload(a: QuoteAnswers, elapsedMs: number, page: string, currency: Currency) {
  // Bands carry their currency ("inr_under_5l"); "not sure" takes the form's currency toggle.
  const [cur, band] = a.budget.startsWith("inr_") || a.budget.startsWith("usd_")
    ? [a.budget.slice(0, 3), a.budget.slice(4)]
    : [currency, a.budget];
  return {
    kind: "quote",
    name: a.name.trim(),
    email: a.email.trim(),
    company: a.company.trim(),
    message: a.message.trim(),
    project_type: a.projectType ? PROJECT_TYPE[a.projectType] : "",
    stage: a.stage,
    currency: cur.toUpperCase(),
    budget: band,
    timeline: a.timeline,
    link: a.link.trim(),
    website: a.website,
    elapsed_ms: elapsedMs,
    page,
  };
}

/** The API's field names back to the form's, for `{error, fields}` responses. */
const FIELD_FROM_API: Record<string, QuoteField> = {
  name: "name",
  email: "email",
  company: "company",
  message: "message",
  projectType: "projectType",
  project_type: "projectType",
  stage: "stage",
  currency: "budget",
  budget: "budget",
  timeline: "timeline",
  link: "link",
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; kind: "fields"; fields: Partial<Record<QuoteField, string>> }
  | { ok: false; kind: "general"; message: string }
  /** Nothing usable came back: the network failed, CORS refused, or the endpoint isn't live. */
  | { ok: false; kind: "unreachable" };

export async function submitEnquiry(body: ReturnType<typeof toEnquiryPayload>): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch(SITE.enquiryEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, kind: "unreachable" };
  }
  if (res.ok) return { ok: true };
  let data: { error?: unknown; fields?: unknown } | null = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!data || typeof data.error !== "string") return { ok: false, kind: "unreachable" };
  if (data.fields && typeof data.fields === "object") {
    const fields: Partial<Record<QuoteField, string>> = {};
    let general = "";
    for (const [key, value] of Object.entries(data.fields as Record<string, unknown>)) {
      const text = Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
      const field = FIELD_FROM_API[key];
      if (field) fields[field] = text;
      else general = general || text;
    }
    if (Object.keys(fields).length) return { ok: false, kind: "fields", fields };
    if (general) return { ok: false, kind: "general", message: general };
  }
  const message =
    data.error === "rate_limited"
      ? "That's a few sends in a short time. Please wait a few minutes and try again."
      : "Something went wrong on our side.";
  return { ok: false, kind: "general", message };
}

const labelOf = <T extends string>(list: { value: T; label: string }[], v: T | "") => list.find((x) => x.value === v)?.label ?? "";

/** The answers as plain lines, for the email fallback and Calendly's first question. */
export function summarise(a: QuoteAnswers): string[] {
  const budgets = [...QUOTE.budgets.inr, ...QUOTE.budgets.usd];
  return [
    `What: ${labelOf(QUOTE.projectTypes, a.projectType)}`,
    `Stage: ${labelOf(QUOTE.stages, a.stage)}`,
    `Budget: ${labelOf(budgets, a.budget)}`,
    `When: ${labelOf(QUOTE.timelines, a.timeline)}`,
    ...(a.link.trim() ? [`Link: ${a.link.trim()}`] : []),
    "",
    a.message.trim(),
  ];
}

export function mailtoFor(a: QuoteAnswers): string {
  const subject = `Project enquiry${a.company.trim() ? `: ${a.company.trim()}` : ""}`;
  const body = [...summarise(a), "", `${a.name.trim()}${a.company.trim() ? `, ${a.company.trim()}` : ""}`, a.email.trim()].join("\n");
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Calendly with name, email and the answers (its first question, `a1`) already filled in. */
export function calendlyFor(a: QuoteAnswers): string {
  const q = new URLSearchParams({ name: a.name.trim(), email: a.email.trim(), a1: summarise(a).join("\n").slice(0, 1800) });
  return `${SITE.calendly}?${q.toString()}`;
}
