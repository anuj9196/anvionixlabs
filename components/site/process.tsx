import { PROCESS } from "@/data/site";

/** The method as a lab procedure, joined by a dashed line that draws itself on scroll. */
export function ProcessPath() {
  return (
    <div className="relative">
      <svg aria-hidden viewBox="0 0 1000 120" preserveAspectRatio="none" className="draw absolute inset-x-0 top-3 hidden h-24 w-full md:block">
        <path
          d="M40 60 C 140 0, 200 0, 240 60 S 380 120, 440 60 S 580 0, 640 60 S 780 120, 840 60 S 940 20, 970 60"
          pathLength={1}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ol className="relative grid gap-8 md:grid-cols-5 md:gap-6 md:pt-28">
        {PROCESS.map((p) => (
          <li key={p.no} className="reveal relative pl-10 md:pl-0">
            <span className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-accent bg-paper font-mono text-[11px] text-accent md:static md:mb-4">
              {p.no}
            </span>
            <h3 className="serif text-3xl">{p.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
