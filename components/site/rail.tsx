/** After Zephyr: the steps as a row of small tiles along the floor of the hero, numbered underneath. */
export function StepRail({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {steps.map((s, i) => (
        <li key={s.title} className="flex flex-col">
          <div className="flex h-full flex-col rounded-2xl border border-ink/15 bg-sheet/45 p-4 backdrop-blur-sm">
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/25 text-ink-2">
              {["☏", "✎", "⚙", "↗"][i]}
            </span>
            <h3 className="mt-4 text-sm font-medium">{s.title}</h3>
            <p className="mt-1 text-[13px] leading-snug text-ink-2">{s.text}</p>
          </div>
          <span className="mt-2 pl-1 font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
        </li>
      ))}
    </ol>
  );
}
