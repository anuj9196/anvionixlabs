"use client";

import { useEffect, useId, useRef, useState } from "react";
import { QUOTE, SITE, engagementById, type Budget, type ProjectType } from "@/data/site";
import { isCurrency, useGuessedCurrency, type Currency } from "@/lib/currency";
import { calendlyFor, mailtoFor, submitEnquiry, toEnquiryPayload, type QuoteAnswers, type QuoteField } from "@/lib/enquiry";

export type QuotePrefill = { type?: string | null; from?: string | null; cur?: string | null; message?: string | null };

const EMPTY: QuoteAnswers = { projectType: "", message: "", stage: "", budget: "", timeline: "", name: "", email: "", company: "", link: "", website: "" };
const PROJECT_TYPES = QUOTE.projectTypes.map((p) => p.value);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ORDER: QuoteField[] = ["projectType", "message", "stage", "budget", "timeline", "name", "email", "company", "link"];

function validate(a: QuoteAnswers): Partial<Record<QuoteField, string>> {
  const e: Partial<Record<QuoteField, string>> = {};
  if (!a.projectType) e.projectType = "Choose what you are building.";
  if (a.message.trim().length < 20) e.message = a.message.trim() ? "A little more, please: who uses it and what must it do?" : "Tell us a little about it.";
  if (!a.stage) e.stage = "Choose where it is today.";
  if (!a.budget) e.budget = "Choose a range, or “Not sure yet”.";
  if (!a.timeline) e.timeline = "Choose when you need it.";
  if (!a.name.trim()) e.name = "Your name, please.";
  if (!EMAIL.test(a.email.trim())) e.email = a.email.trim() ? "That email address doesn't look right." : "Your email, so we can reply.";
  if (!a.company.trim()) e.company = "Your company, or “Independent”.";
  if (a.link.trim() && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(a.link.trim())) e.link = "That doesn't look like a web address.";
  return e;
}

/** One analytics lead per sent form; booking a call afterwards isn't counted again. */
function trackLead(a: QuoteAnswers) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", "generate_lead", { form: "quote", project_type: a.projectType, budget: a.budget, timeline: a.timeline });
}

type Status = { s: "idle" } | { s: "sending" } | { s: "sent" } | { s: "error"; message: string } | { s: "unreachable" };

export function QuoteForm({ prefill = {} }: { prefill?: QuotePrefill }) {
  const id = useId();
  const fromEngagement = prefill.from ? engagementById(prefill.from) : undefined;
  const initialType = (PROJECT_TYPES as string[]).includes(prefill.type ?? "") ? (prefill.type as ProjectType) : (fromEngagement?.projectType ?? "");
  const [a, setA] = useState<QuoteAnswers>({ ...EMPTY, projectType: initialType, message: (prefill.message ?? "").slice(0, 4000) });
  const [touched, setTouched] = useState<Partial<Record<QuoteField, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Partial<Record<QuoteField, string>>>({});
  const [status, setStatus] = useState<Status>({ s: "idle" });
  const guessed = useGuessedCurrency();
  const [chosenCur, setChosenCur] = useState<Currency | null>(isCurrency(prefill.cur) ? prefill.cur : null);
  const cur = chosenCur ?? guessed;
  const openedAt = useRef(0);
  const tracked = useRef(false);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    openedAt.current = performance.now();
  }, []);
  useEffect(() => {
    if (status.s === "sent") doneHeading.current?.focus();
  }, [status.s]);

  const errors = { ...validate(a), ...serverErrors };
  const shown = (f: QuoteField) => (touched[f] || serverErrors[f] ? errors[f] : undefined);
  const set = <K extends keyof QuoteAnswers>(k: K, v: QuoteAnswers[K]) => {
    setA((prev) => ({ ...prev, [k]: v }));
    if (k !== "website") setServerErrors((prev) => ({ ...prev, [k]: undefined }));
  };
  const touch = (f: QuoteField) => setTouched((t) => (t[f] ? t : { ...t, [f]: true }));
  const pickCurrency = (c: Currency) => {
    setChosenCur(c);
    if (a.budget && a.budget !== "not_sure") set("budget", "");
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status.s === "sending") return;
    const local = validate(a);
    setTouched(Object.fromEntries(ORDER.map((f) => [f, true])));
    const first = ORDER.find((f) => local[f]);
    if (first) {
      form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setStatus({ s: "sending" });
    const result = await submitEnquiry(toEnquiryPayload(a, Math.round(performance.now() - openedAt.current), window.location.pathname));
    if (result.ok) {
      if (!tracked.current) {
        tracked.current = true;
        trackLead(a);
      }
      setStatus({ s: "sent" });
    } else if (result.kind === "fields") {
      setServerErrors(result.fields);
      setStatus({ s: "idle" });
      const firstBad = ORDER.find((f) => result.fields[f]);
      if (firstBad) form.current?.querySelector<HTMLElement>(`[data-field="${firstBad}"]`)?.focus();
    } else if (result.kind === "general") {
      setStatus({ s: "error", message: result.message });
    } else {
      setStatus({ s: "unreachable" });
    }
  };

  if (status.s === "sent") {
    return (
      <div className="rounded-3xl border border-rule bg-sheet p-6 md:p-10" role="status">
        <p className="label">Brief received</p>
        <h2 ref={doneHeading} tabIndex={-1} className="serif mt-3 text-4xl leading-tight outline-none md:text-5xl">
          Thanks — we&apos;ll reply {QUOTE.replyTime} from <span className="whitespace-nowrap">{SITE.email}</span>.
        </h2>
        <p className="mt-4 max-w-lg text-ink-2">Want to talk sooner? Pick a time; your answers are already filled in.</p>
        <a
          href={calendlyFor(a)}
          target="_blank"
          rel="noopener"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-paper transition-colors hover:bg-accent hover:text-accent-ink"
        >
          Book a call now <span aria-hidden>↗</span>
        </a>
      </div>
    );
  }

  const err = (f: QuoteField) => `${id}-${f}-err`;
  const sending = status.s === "sending";

  return (
    <form ref={form} onSubmit={submit} noValidate className="relative rounded-3xl border border-rule bg-sheet p-5 md:p-9" aria-describedby={`${id}-intro`}>
      <p id={`${id}-intro`} className="font-mono text-[12px] text-ink-3">
        Every field helps us quote accurately. Takes about two minutes.
      </p>
      {fromEngagement && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-rule px-3 py-1 text-xs text-ink-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          From pricing: {fromEngagement.name}
        </p>
      )}

      <Choice
        name="projectType"
        legend="What are you building?"
        options={QUOTE.projectTypes}
        value={a.projectType}
        onChange={(v) => set("projectType", v)}
        onBlur={() => touch("projectType")}
        error={shown("projectType")}
        errId={err("projectType")}
        wide
      />

      <div className="mt-8">
        <label htmlFor={`${id}-message`} className="block text-base font-medium">
          Describe it
        </label>
        <p id={`${id}-message-hint`} className="mt-1 text-sm text-ink-3">
          Who uses it, and what must it do? A few lines is plenty.
        </p>
        <textarea
          id={`${id}-message`}
          data-field="message"
          rows={5}
          value={a.message}
          maxLength={4000}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => touch("message")}
          aria-invalid={!!shown("message")}
          aria-describedby={`${id}-message-hint${shown("message") ? ` ${err("message")}` : ""}`}
          className={inputCls(!!shown("message")) + " mt-3 resize-y"}
        />
        <FieldError id={err("message")} text={shown("message")} />
      </div>

      <Choice name="stage" legend="Stage" options={QUOTE.stages} value={a.stage} onChange={(v) => set("stage", v)} onBlur={() => touch("stage")} error={shown("stage")} errId={err("stage")} />

      <Choice
        name="budget"
        legend="Budget range"
        options={QUOTE.budgets[cur]}
        value={a.budget}
        onChange={(v) => set("budget", v as Budget)}
        onBlur={() => touch("budget")}
        error={shown("budget")}
        errId={err("budget")}
        aside={
          <div className="inline-flex rounded-full border border-rule p-0.5" role="group" aria-label="Currency">
            {(["inr", "usd"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => pickCurrency(c)}
                aria-pressed={cur === c}
                className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] ${cur === c ? "bg-ink text-paper" : "text-ink-2"}`}
              >
                {c === "inr" ? "₹ INR" : "$ USD"}
              </button>
            ))}
          </div>
        }
      />

      <Choice
        name="timeline"
        legend="When do you need it?"
        options={QUOTE.timelines}
        value={a.timeline}
        onChange={(v) => set("timeline", v)}
        onBlur={() => touch("timeline")}
        error={shown("timeline")}
        errId={err("timeline")}
      />

      <div className="mt-10 grid gap-6 border-t border-rule pt-8 sm:grid-cols-2">
        <Text id={`${id}-name`} field="name" label="Name" autoComplete="name" value={a.name} onChange={(v) => set("name", v)} onBlur={() => touch("name")} error={shown("name")} errId={err("name")} />
        <Text id={`${id}-email`} field="email" label="Email" type="email" autoComplete="email" value={a.email} onChange={(v) => set("email", v)} onBlur={() => touch("email")} error={shown("email")} errId={err("email")} />
        <Text id={`${id}-company`} field="company" label="Company" autoComplete="organization" value={a.company} onChange={(v) => set("company", v)} onBlur={() => touch("company")} error={shown("company")} errId={err("company")} />
        <Text
          id={`${id}-link`}
          field="link"
          label="Link"
          optional
          hint="Your site, a design file or a doc"
          type="url"
          inputMode="url"
          autoComplete="url"
          value={a.link}
          onChange={(v) => set("link", v)}
          onBlur={() => touch("link")}
          error={shown("link")}
          errId={err("link")}
        />
      </div>

      {/* Honeypot: clipped out of sight (not pushed off-screen) and out of the tab order. People leave it empty. */}
      <div aria-hidden className="absolute h-px w-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)] [clip:rect(0_0_0_0)]">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={a.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div aria-live="polite" className="mt-8 empty:hidden">
        {status.s === "error" && (
          <p className="rounded-2xl border border-rule bg-paper/60 p-4 text-sm text-ink">
            {status.message} Try again, or email{" "}
            <a href={mailtoFor(a)} className="underline hover:text-accent">
              {SITE.email}
            </a>{" "}
            with your answers.
          </p>
        )}
        {status.s === "unreachable" && (
          <div className="rounded-2xl border border-rule bg-paper/60 p-4 text-sm">
            <p className="font-medium text-ink">Couldn&apos;t send — email {SITE.email}</p>
            <p className="mt-1 text-ink-2">Your answers are copied into the email; just press send.</p>
            <a href={mailtoFor(a)} className="mt-3 inline-flex items-center gap-2 rounded-full border border-ink/40 px-4 py-2 text-ink hover:bg-ink hover:text-paper">
              Email your answers to {SITE.email} <span aria-hidden>→</span>
            </a>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-paper transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send the brief"} <span aria-hidden>→</span>
        </button>
        <a href={SITE.calendly} target="_blank" rel="noopener" className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
          Prefer a call? Book 20 minutes
        </a>
      </div>
      <p className="mt-4 text-xs text-ink-3">We reply {QUOTE.replyTime}, from {SITE.email}. Your details are used only to answer you.</p>
    </form>
  );
}

const inputCls = (bad: boolean) =>
  `block w-full rounded-xl border bg-paper/60 px-4 py-3 text-base text-ink outline-none placeholder:text-ink-3 focus:border-accent ${bad ? "border-[#ff8a7a]" : "border-rule"}`;

function FieldError({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} className="mt-2 text-sm text-[#ffb3a7]">
      {text}
    </p>
  ) : null;
}

function Choice<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  onBlur,
  error,
  errId,
  wide = false,
  aside,
}: {
  name: QuoteField;
  legend: string;
  options: { value: T; label: string }[];
  value: T | "";
  onChange: (v: T) => void;
  onBlur: () => void;
  error?: string;
  errId: string;
  wide?: boolean;
  aside?: React.ReactNode;
}) {
  const group = useId();
  return (
    <fieldset className="mt-8" aria-describedby={error ? errId : undefined} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && onBlur()}>
      <legend className="float-left text-base font-medium">{legend}</legend>
      {aside && <div className="float-right">{aside}</div>}
      <div className={`clear-both pt-3 ${wide ? "grid gap-2 sm:grid-cols-2" : "flex flex-wrap gap-2"}`}>
        {options.map((o, i) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${wide ? "" : "whitespace-nowrap"} transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                checked ? "border-accent bg-accent/15 text-ink" : error ? "border-[#ff8a7a]/70 text-ink-2 hover:border-ink-3" : "border-rule text-ink-2 hover:border-ink-3"
              }`}
            >
              <input
                type="radio"
                name={`${group}-${name}`}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                data-field={i === 0 ? name : undefined}
                className="sr-only"
              />
              <span aria-hidden className={`h-3.5 w-3.5 shrink-0 rounded-full border ${checked ? "border-accent bg-accent" : "border-ink-3"}`} />
              {o.label}
            </label>
          );
        })}
      </div>
      <FieldError id={errId} text={error} />
    </fieldset>
  );
}

function Text({
  id,
  field,
  label,
  value,
  onChange,
  onBlur,
  error,
  errId,
  optional = false,
  hint,
  type = "text",
  inputMode,
  autoComplete,
}: {
  id: string;
  field: QuoteField;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  errId: string;
  optional?: boolean;
  hint?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) {
  const describedBy = [hint && `${id}-hint`, error && errId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label} {optional && <span className="font-normal text-ink-3">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-xs text-ink-3">
          {hint}
        </p>
      )}
      <input
        id={id}
        data-field={field}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        maxLength={field === "link" ? 300 : 160}
        required={!optional}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={inputCls(!!error) + " mt-2"}
      />
      <FieldError id={errId} text={error} />
    </div>
  );
}
