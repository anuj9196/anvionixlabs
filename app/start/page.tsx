import type { Metadata } from "next";
import { SITE } from "@/data/site";
import { BuildPrompt } from "@/components/site/prompt";
import { JsonLd, breadcrumbLd } from "@/components/site/json-ld";

export const metadata: Metadata = {
  title: "Start a project: tell us what you are building",
  description:
    "Describe what you want to build or fix in a line or two, and book a free 30-minute intro call with Anvionix Labs with your note already attached.",
  alternates: { canonical: "/start" },
};

/** After Mobula: the whole screen is the prompt, circled by a school of pixel rays. */
export default function StartPage() {
  return (
    <div data-world="mobula">
      <section className="wrap flex min-h-[calc(100dvh-64px)] flex-col justify-center py-10">
        <BuildPrompt rays heading="h1" />
        <p className="mt-2 text-center font-mono text-[12px] text-ink-3">
          Prefer writing? <a href={`mailto:${SITE.email}`} className="underline hover:text-ink">{SITE.email}</a> · {SITE.phone}
        </p>
      </section>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Start a project", path: "/start" }])} />
    </div>
  );
}
