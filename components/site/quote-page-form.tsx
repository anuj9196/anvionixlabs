"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QuoteForm } from "./quote-form";

/** Prefills the form from the link that led here: ?from=<engagement id>, ?type=, ?cur=, ?message=. */
function WithParams() {
  const q = useSearchParams();
  const prefill = { type: q.get("type"), from: q.get("from"), cur: q.get("cur"), message: q.get("message") };
  return <QuoteForm key={q.toString()} prefill={prefill} />;
}

/** The static export renders the empty form; the browser fills it in from the address. */
export function QuotePageForm() {
  return (
    <Suspense fallback={<QuoteForm />}>
      <WithParams />
    </Suspense>
  );
}
