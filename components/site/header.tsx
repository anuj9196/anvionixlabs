import Link from "next/link";
import { NAV, SITE } from "@/data/site";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-mono text-[13px] tracking-[0.22em] uppercase ${className}`}>
      Anvionix<span className="text-accent">/</span>Labs
    </span>
  );
}

/** The main call to action everywhere: the quote form (/start), optionally prefilled. */
export function QuoteButton({ className = "", href = "/start", children = "Get a quote" }: { className?: string; href?: string; children?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-ink transition-colors ${className}`}
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

/** The secondary way in, for people who would rather talk first. */
export function CallLink({ className = "" }: { className?: string }) {
  return (
    <a href={SITE.calendly} target="_blank" rel="noopener" className={`text-sm text-ink-2 underline underline-offset-4 hover:text-ink ${className}`}>
      Prefer a call? Book 20 minutes
    </a>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={`${SITE.name} home`}>
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden md:flex items-center gap-7 text-sm text-ink-2">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ink">
              {n.label}
            </Link>
          ))}
          <QuoteButton className="!py-2" />
        </nav>
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer rounded-full border border-rule px-4 py-2 text-sm [&::-webkit-details-marker]:hidden">Menu</summary>
          <nav aria-label="Main" className="absolute right-0 mt-2 w-56 rounded-xl border border-rule bg-sheet p-2 shadow-lg">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-paper">
                {n.label}
              </Link>
            ))}
            <Link href="/start" className="mt-1 block rounded-lg bg-ink px-3 py-2.5 text-sm text-paper">
              Get a quote →
            </Link>
            <a href={SITE.calendly} target="_blank" rel="noopener" className="block rounded-lg px-3 py-2.5 text-sm text-ink-2 hover:bg-paper">
              Or book a call ↗
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
