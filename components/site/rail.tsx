/** Steps on a rail across the bottom of a hero: the line draws in as it comes into view. */
export function StepRail({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <div className="relative">
      <svg aria-hidden viewBox="0 0 1000 8" preserveAspectRatio="none" className="draw absolute left-0 right-0 top-[15px] hidden h-2 w-full md:block">
        <path d="M12 4 H988" pathLength={1} fill="none" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className="relative grid gap-6 md:grid-cols-4 md:gap-8">
        {steps.map((s, i) => (
          <li key={s.title} className="relative pl-12 md:pl-0">
            <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-accent bg-paper font-mono text-xs text-accent md:static">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="serif mt-0 text-2xl md:mt-4">
              <em>{s.title}</em>
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
