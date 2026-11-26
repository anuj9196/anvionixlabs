import Link from "next/link";
import type { Service, ServiceSlug } from "@/data/site";
import { SceneCanvas } from "./scene-canvas";
import type { SceneId } from "./scenes";

/** The scene looping in each card: it takes the card's text colour, so it reads on the light and dark faces. */
const CARD_SCENES: Record<ServiceSlug, SceneId[]> = {
  "web-apps": ["sketch"],
  "backend-apis": ["blocks", "deploy"],
  "mobile-apps": ["mobile"],
  consulting: ["consult"],
};

const WORDS = "Design · Build · Ship · Run · ";

/** The services as glass cards, fanned over a line of huge text sliding past behind them. */
export function ServiceDeck({ items }: { items: Service[] }) {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
        <div className="marquee flex w-max whitespace-nowrap text-[22vw] font-semibold leading-none tracking-[-0.05em] text-ink/[0.06] lg:text-[15rem]">
          <span>{WORDS.repeat(3)}</span>
          <span>{WORDS.repeat(3)}</span>
        </div>
      </div>
      <ul className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:[perspective:1600px]">
        {items.map((s, i) => (
          <li key={s.slug} className={`deck-card ${i % 2 ? "lg:translate-y-10" : ""}`} style={{ ["--r" as string]: `${(i - 1.5) * 5}deg` }}>
            <Link
              href={`/services/${s.slug}`}
              className={`group flex h-full min-h-[380px] flex-col rounded-[26px] border border-white/15 p-5 shadow-[0_40px_80px_-40px_rgba(0,0,0,.7)] backdrop-blur-md transition-transform duration-500 hover:-translate-y-2 ${
                i === 0
                  ? "bg-[conic-gradient(from_210deg_at_60%_40%,#f7f5f2,#e4a47e,#ffffff,#ebc0a5,#f7f5f2)] text-[#202124]"
                  : "bg-[radial-gradient(120%_90%_at_70%_10%,#8a4a2a_0%,#3a3b3f_45%,#202124_100%)] text-white"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs ${i === 0 ? "bg-black/10" : "bg-white/15"}`}>{s.name}</span>
                <span className="font-mono text-xs opacity-60">{s.no}</span>
              </span>
              <span className="mt-4 block" aria-hidden>
                <SceneCanvas scenes={CARD_SCENES[s.slug as ServiceSlug]} tone="self" minText={8.5} />
              </span>
              <span className="mt-auto block text-2xl font-semibold leading-tight tracking-tight">{s.title.split(":")[0]}</span>
              <span className="mt-2 block text-sm opacity-75">{s.short}</span>
              <span className="mt-4 block text-sm font-medium">Explore →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
